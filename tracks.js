/**
 * Music Tracks Data
 *
 * IMPORTANT: Replace these sample URLs with your actual MP3 file URLs
 *
 * For AWS S3/Amplify deployment:
 * 1. Upload your MP3 files to S3 bucket
 * 2. Generate signed URLs or make files publicly accessible (with HTTPS)
 * 3. Replace the URLs below with your actual S3 URLs
 *
 * Example S3 URL format:
 * https://your-bucket-name.s3.region.amazonaws.com/path/to/your-file.mp3
 *
 * Or use CloudFront distribution URL for better performance:
 * https://your-cloudfront-id.cloudfront.net/path/to/your-file.mp3
 */

const MUSIC_TRACKS = [
    {
        title: "Summer Breeze",
        artist: "Sample Artist 1",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: 237 // in seconds (3:57)
    },
    {
        title: "Night Rhythm",
        artist: "Sample Artist 2",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: 243 // in seconds (4:03)
    },
    {
        title: "Ocean Waves",
        artist: "Sample Artist 3",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: 251 // in seconds (4:11)
    },
    {
        title: "Mountain Echo",
        artist: "Sample Artist 4",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        duration: 229 // in seconds (3:49)
    },
    {
        title: "City Lights",
        artist: "Sample Artist 5",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        duration: 248 // in seconds (4:08)
    },
    {
        title: "Forest Trail",
        artist: "Sample Artist 6",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        duration: 256 // in seconds (4:16)
    },
    {
        title: "Desert Wind",
        artist: "Sample Artist 7",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        duration: 234 // in seconds (3:54)
    },
    {
        title: "Rainy Day",
        artist: "Sample Artist 8",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        duration: 241 // in seconds (4:01)
    }
];

/**
 * DEPLOYMENT NOTES FOR AWS S3/AMPLIFY:
 *
 * 1. AWS S3 Setup:
 *    - Create an S3 bucket for your music files
 *    - Enable static website hosting
 *    - Configure CORS settings to allow audio playback:
 *      {
 *        "AllowedOrigins": ["*"],
 *        "AllowedMethods": ["GET", "HEAD"],
 *        "AllowedHeaders": ["*"],
 *        "MaxAgeSeconds": 3000
 *      }
 *
 * 2. Upload MP3 Files:
 *    - Upload your MP3 files to the S3 bucket
 *    - Set appropriate permissions (public read access or signed URLs)
 *    - Ensure HTTPS is enforced
 *
 * 3. Security Considerations:
 *    - Use CloudFront with signed URLs to prevent direct download
 *    - Implement referer checking
 *    - Consider using pre-signed URLs with expiration times
 *
 * 4. Performance Optimization:
 *    - Use CloudFront CDN for faster global delivery
 *    - Enable S3 Transfer Acceleration if needed
 *    - Compress MP3 files to appropriate bitrate (128-192 kbps recommended)
 *
 * 5. Sample S3 Bucket Policy (adjust as needed):
 *    {
 *      "Version": "2012-10-17",
 *      "Statement": [
 *        {
 *          "Sid": "PublicReadGetObject",
 *          "Effect": "Allow",
 *          "Principal": "*",
 *          "Action": "s3:GetObject",
 *          "Resource": "arn:aws:s3:::your-bucket-name/*"
 *        }
 *      ]
 *    }
 */
