# Web Music Player

A lightweight, browser-based music player that allows users to listen to music directly in their web browser without any installation required.

## Features

✅ **Music Playback**
- Continuous playback (auto-advance to next track)
- Shuffle mode (random playback order)
- Repeat mode (loop current track)

✅ **Player Controls**
- Play / Pause / Stop
- Next / Previous track
- Volume control with mute
- Seek bar (progress bar)

✅ **User Interface**
- Clean, modern design
- Track list with duration display
- Now playing display
- Responsive design (Desktop, Tablet, Mobile)

✅ **Keyboard Shortcuts**
- `Space` - Play/Pause
- `→` - Next track
- `←` - Previous track
- `↑` - Volume up
- `↓` - Volume down
- `M` - Mute/Unmute
- `S` - Toggle shuffle
- `R` - Toggle repeat

## Files Structure

```
desmond/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js             # Player functionality
├── tracks.js          # Music tracks data
├── requirment.md      # Requirements specification
├── layout-specification.md  # Layout design document
└── README.md          # This file
```

## Local Development

1. **Open the application:**
   - Simply open `index.html` in a web browser
   - Or use a local web server (recommended):

   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using PHP
   php -S localhost:8000

   # Using Node.js (http-server)
   npx http-server
   ```

2. **Access the application:**
   - Navigate to `http://localhost:8000`

## Customizing Music Tracks

### Option 1: Update tracks.js

Edit the `tracks.js` file and replace the sample tracks with your own:

```javascript
const MUSIC_TRACKS = [
    {
        title: "Your Song Title",
        artist: "Artist Name",
        url: "https://your-server.com/path/to/song.mp3",
        duration: 180  // in seconds
    },
    // Add more tracks...
];
```

### Option 2: Use Local MP3 Files

For local testing, you can place MP3 files in the project directory:

```javascript
const MUSIC_TRACKS = [
    {
        title: "My Song",
        artist: "My Artist",
        url: "./music/my-song.mp3",  // Relative path
        duration: 180
    }
];
```

**Note:** When deploying to AWS S3/Amplify, use full HTTPS URLs.

## AWS Deployment

### Option 1: AWS S3 Static Website Hosting

1. **Create an S3 Bucket:**
   ```bash
   aws s3 mb s3://your-music-player-bucket
   ```

2. **Enable Static Website Hosting:**
   - Go to S3 Console > Your Bucket > Properties
   - Enable "Static website hosting"
   - Set index document: `index.html`

3. **Configure CORS:**
   Create a CORS configuration file (`cors.json`):
   ```json
   [
       {
           "AllowedOrigins": ["*"],
           "AllowedMethods": ["GET", "HEAD"],
           "AllowedHeaders": ["*"],
           "MaxAgeSeconds": 3000
       }
   ]
   ```

   Apply CORS:
   ```bash
   aws s3api put-bucket-cors --bucket your-music-player-bucket --cors-configuration file://cors.json
   ```

4. **Upload Files:**
   ```bash
   aws s3 sync . s3://your-music-player-bucket --exclude ".git/*" --exclude "*.md"
   ```

5. **Make Files Public:**
   ```bash
   aws s3api put-bucket-policy --bucket your-music-player-bucket --policy '{
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::your-music-player-bucket/*"
     }]
   }'
   ```

6. **Upload MP3 Files:**
   ```bash
   aws s3 cp ./music/ s3://your-music-player-bucket/music/ --recursive
   ```

7. **Update tracks.js:**
   Update the URLs in `tracks.js` to point to your S3 bucket:
   ```javascript
   url: "https://your-music-player-bucket.s3.amazonaws.com/music/song.mp3"
   ```

8. **Access Your Site:**
   - URL: `http://your-music-player-bucket.s3-website-region.amazonaws.com`

### Option 2: AWS Amplify Hosting

1. **Install Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify:**
   ```bash
   amplify init
   ```

3. **Add Hosting:**
   ```bash
   amplify add hosting
   ```
   - Choose: Hosting with Amplify Console
   - Choose: Manual deployment

4. **Publish:**
   ```bash
   amplify publish
   ```

5. **Upload MP3 Files to S3:**
   - Create a separate S3 bucket for MP3 files
   - Upload your music files
   - Update `tracks.js` with S3 URLs

### Option 3: CloudFront CDN (Recommended for Production)

For better performance and security:

1. **Create CloudFront Distribution:**
   - Origin: Your S3 bucket
   - Enable HTTPS only
   - Enable compression

2. **Configure Signed URLs (Optional):**
   - Protects MP3 files from direct download
   - Implement using AWS Lambda@Edge

3. **Update tracks.js:**
   ```javascript
   url: "https://your-cloudfront-id.cloudfront.net/music/song.mp3"
   ```

## Security Considerations

1. **HTTPS Only:**
   - All traffic must use HTTPS (required by modern browsers for audio playback)

2. **Protect MP3 Files:**
   - Use CloudFront signed URLs
   - Implement referer checking
   - Use time-limited access tokens

3. **CORS Configuration:**
   - Only allow necessary origins in production
   - Restrict to your domain

4. **Content Security Policy (Optional):**
   Add to `index.html`:
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self'; media-src 'self' https://your-cdn.com;">
   ```

## Browser Compatibility

Tested and supported on:
- ✅ Chrome (latest + 2 versions)
- ✅ Safari (latest + 1 version, iOS supported)
- ✅ Edge (latest version)
- ✅ Firefox (latest version)

## Performance Optimization

1. **MP3 File Optimization:**
   - Recommended bitrate: 128-192 kbps
   - Use consistent sample rate (44.1 kHz)
   - Keep file sizes reasonable (3-5 MB per 3-5 minute song)

2. **CloudFront Caching:**
   - Enable caching for static assets (HTML, CSS, JS)
   - Set appropriate cache headers for MP3 files

3. **Lazy Loading:**
   - Audio files are loaded on-demand
   - Only the current track is buffered

## Troubleshooting

### Audio Not Playing
- Check browser console for errors
- Verify MP3 file URLs are accessible (HTTPS)
- Ensure CORS is properly configured
- Check that MP3 files are valid format

### Slow Loading
- Use CloudFront CDN
- Optimize MP3 file sizes
- Enable S3 Transfer Acceleration

### Mobile Issues
- Ensure HTTPS is used (required by iOS)
- Test on actual devices, not just browser emulation
- Check touch target sizes (minimum 44x44px)

## Future Enhancements

- [ ] Playlist management (create, save, edit)
- [ ] Album artwork display
- [ ] Equalizer / audio visualization
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Social sharing features
- [ ] User accounts and preferences

## License

This project is provided as-is for educational and personal use.

**Important:** Ensure you have proper rights and licenses for any music content you host.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify your AWS configuration
4. Check CORS and security settings

---

**Happy Listening! 🎵**
