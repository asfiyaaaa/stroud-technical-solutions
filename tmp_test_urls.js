function buildResumeUrls(secureUrl) {
    return {
        viewUrl: secureUrl,                 // opens in browser
        downloadUrl: secureUrl + "?dl=1",   // forces download
    };
}

const secureUrl = "https://res.cloudinary.com/demo/raw/upload/v1/resumes/my_resume.pdf";
const urls = buildResumeUrls(secureUrl);

console.log("Input:", secureUrl);
console.log("View URL:", urls.viewUrl);
console.log("Download URL:", urls.downloadUrl);

if (urls.viewUrl === secureUrl && urls.downloadUrl === secureUrl + "?dl=1") {
    console.log("SUCCESS: URL logic is correct.");
} else {
    console.log("FAILURE: URL logic is incorrect.");
    process.exit(1);
}
