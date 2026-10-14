
# SnapShare: Photo-Sharing App Scaling Plan

## 1. Assumptions and Load Estimates

SnapShare is a photo-sharing application where users upload photos and view feeds containing photos from people they follow.

The following assumptions are used:

- Registered users: 10,000,000.
- Daily active users: 10% of registered users.
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Each original photo averages 2 MB.
- Each photo generates one thumbnail of 50 KB.
- A day is approximated as 100,000 seconds for easy calculations.
- Peak traffic is estimated at five times the average rate.
- Storage estimates exclude database metadata, backups and additional replicated copies.

### Daily Active Users

10,000,000 × 10% = 1,000,000 daily active users.

### Uploads per Second

Daily uploads = 1,000,000 users × 1 photo = 1,000,000 uploads.

Average uploads per second = 1,000,000 ÷ 100,000 = 10 uploads/second.

Peak uploads per second = 10 × 5 = 50 uploads/second.

### Feed Views per Second

Daily feed views = 1,000,000 users × 50 views = 50,000,000 views.

Average feed views per second = 50,000,000 ÷ 100,000 = 500 views/second.

Peak feed views per second = 500 × 5 = 2,500 views/second.

### Storage per Year

Original photos per day:

1,000,000 × 2 MB = 2,000,000 MB = 2,000 GB per day.

Thumbnails per day:

1,000,000 × 50 KB = 50,000,000 KB = 50 GB per day.

Total storage per day = 2,000 GB + 50 GB = 2,050 GB.

Total storage per year = 2,050 GB × 365 = 748,250 GB, or approximately 748 TB per year using decimal units.

This estimate covers original photos and thumbnails only. Actual storage requirements will be higher when backups, replication and other application data are included.

## 2. Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system because users view approximately 50 feed pages for every photo they upload. The design should prioritise fast feed delivery by caching frequently accessed feeds and using a CDN to deliver photo files efficiently. Read replicas can also handle database read queries, reducing the workload on the primary database.

## 3. Why Photos Should Use Object Storage

Original photos and thumbnails should be stored in object storage rather than directly inside the relational database. Photos are large binary files, and storing them in object storage makes it easier to scale storage independently, manage files efficiently and deliver them through a CDN. The database should store metadata such as the photo ID, owner, caption, upload time and object-storage key or URL.

## 4. Scaled Architecture Diagram

```text
                       ┌──────────────┐
                       │     Users    │
                       │ Web / Mobile │
                       └──────┬───────┘
                              │
                         ┌────▼────┐
                         │   DNS   │
                         └────┬────┘
                              │
                  ┌───────────▼───────────┐
                  │          CDN          │
                  │ Photos and thumbnails│
                  │ Cached static files   │
                  └───────────┬───────────┘
                              │ Cache miss /
                              │ API requests
                       ┌──────▼──────┐
                       │    Load     │
                       │  Balancer   │
                       └──────┬──────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────▼─────┐       ┌─────▼─────┐
              │ App Server│       │ App Server│
              │     1     │       │     2     │
              └──┬───┬────┘       └──┬───┬────┘
                 │   │               │   │
          ┌──────▼┐ ┌▼─────────┐ ┌───▼───▼────┐
          │ Cache │ │  Primary │ │   Message  │
          │ Redis │ │ Database │ │   Queue    │
          └───────┘ └────┬─────┘ └──────┬─────┘
                         │              │
                    Replication         ▼
                         │         ┌──────────┐
                  ┌──────▼─────┐   │ Thumbnail│
                  │ Read       │   │  Worker  │
                  │ Replica    │   └────┬─────┘
                  └────────────┘        │
                                        │
                          ┌─────────────▼────────────┐
                          │      Object Storage      │
                          │ Original photos and      │
                          │ generated thumbnails     │
                          └──────────────────────────┘
```

## 5. Components and the Problems They Solve

- **DNS:** Translates SnapShare's domain name into the network address needed to reach the service.
- **CDN:** Delivers photos and thumbnails from nearby edge servers, reducing download latency and origin-server traffic.
- **Load balancer:** Distributes incoming API requests across healthy application servers to prevent one server from becoming overloaded.
- **Application servers:** Handle authentication, photo uploads, feed requests, permissions and business logic.
- **Cache (Redis):** Stores frequently requested feed data to reduce database queries and improve response times.
- **Primary database:** Stores authoritative application data, including users, follows, photo metadata and feed-related records.
- **Read replica:** Handles eligible read queries so the primary database can focus on writes.
- **Object storage:** Stores large original photo files and thumbnails separately from the relational database.
- **Message queue:** Holds thumbnail-generation jobs so photo uploads do not have to wait for image processing to finish.
- **Thumbnail worker:** Processes queued jobs, generates smaller versions of photos and saves them to object storage.

## 6. Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.
2. The request reaches the load balancer, which forwards it to a healthy application server.
3. The application server authenticates the user and validates the file type, file size and upload permissions.
4. The original photo is uploaded to object storage, using a unique object key to identify it.
5. The application server saves the photo metadata and storage key in the primary database.
6. The application server adds a thumbnail-generation job to the message queue and returns a successful response to the user, without waiting for thumbnail processing.
7. A background worker retrieves the job, reads the original photo from object storage and generates a 50 KB thumbnail.
8. The worker saves the thumbnail in object storage and updates the photo's processing status in the database if necessary.
9. The CDN can then deliver the original photo and thumbnail to users, caching them according to the configured caching policy.

If thumbnail processing fails, the job can be retried with appropriate limits, while the system preserves the original photo and records the processing status.

## 7. Trade-Offs

### Speed vs. Freshness

Caching feeds and using read replicas improve response times and reduce database load. However, cached feeds or replicated data may briefly be outdated. SnapShare can accept short delays for ordinary feed updates, while invalidating affected cache entries when important changes occur.

### Cost vs. Reliability

Running multiple application servers, database replicas and backups improves availability and recovery. However, it increases infrastructure and operational costs. SnapShare should begin with the capacity it needs and add redundancy as its reliability requirements grow.

### Simplicity vs. Scalability

A single application and database are simpler to build and maintain. Multiple application servers, a queue and background workers support higher traffic and independent processing, but introduce additional components to monitor and troubleshoot.

### Fast Uploads vs. Immediate Thumbnail Availability

Processing thumbnails in the background allows users to upload photos without waiting for image processing. However, thumbnails may not be available immediately after upload. The application should show a processing placeholder until the thumbnail is ready.

## 8. Conclusion

SnapShare is expected to support one million daily active users, approximately 10 average photo uploads per second and 500 average feed views per second. Its estimated original-photo and thumbnail storage growth is approximately 748 TB per year. A horizontally scalable application tier, caching, a CDN, a relational database with a read replica, object storage and asynchronous thumbnail processing provide a practical foundation for handling this workload without overcomplicating the initial design.
