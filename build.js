import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import matter from "gray-matter";
import { marked } from "marked";

// get the directory this script is located in
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR_NAME = "blog"
const POSTS_DIR = path.join(__dirname, BLOG_DIR_NAME, "md");
const OUTPUT_DIR = path.join(__dirname, BLOG_DIR_NAME);
const TEMPLATE_POST_PATH = path.join(__dirname, "templates", "post.html");
const TEMPLATE_BLOG_PATH = path.join(__dirname, "templates", "blog.html");

function formatDate(date) {
    if (!date) {
        return "";
    }
    if (date instanceof Date) {
        return date.toISOString().split("T")[0];
    }

    return String(date);
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createBlogCard(link, date, title) {
    return `
        <a href="${link}" class="blog-card">
            <p><b>${date}</b></p>
            <p>${title}</p>
        </a>
    `;
}

// build main blog page
async function buildBlog() {
    console.log("Building blog...");

    const blogTemplate = await fs.readFile(
        TEMPLATE_BLOG_PATH,
        "utf8"
    );

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const files = await fs.readdir(POSTS_DIR);

    const markdownFiles = files.filter(
        file => file.endsWith(".md") || file.endsWith(".markdown")
    );

    const posts = [];

    for (const file of markdownFiles) {
        const inputPath = path.join(POSTS_DIR, file);

        // parse markdown to html
        const markdown = await fs.readFile(inputPath, "utf8");
        const { data, content } = matter(markdown);

        // get filename and slugify
        const filename = path.basename(file, path.extname(file));
        const slug = slugify(filename);

        // get metadata
        const title = escapeHtml(data.title || "Untitled");
        const author = escapeHtml(data.author || "Unknown author");
        const date = data.date || "";
        const description = escapeHtml(data.description || "");

        const blogLink = path.join(BLOG_DIR_NAME, `${slug}.html`);

        posts.push({
            title,
            author,
            date,
            description,
            blogLink
        });
    }

    // newest to oldest
    posts.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    // generate blog cards
    let blogListHtml = "";

    for (const post of posts) {
        blogListHtml += createBlogCard(
            post.blogLink,
            formatDate(post.date),
            post.title
        );
    }

    // insert cards into template
    let blogHtml = blogTemplate;

    blogHtml = blogHtml.replaceAll(
        "{{blogs}}",
        blogListHtml
    );

    // write blog html
    const outputPath = path.join(
        __dirname,
        "blog.html"
    );

    await fs.writeFile(
        outputPath,
        blogHtml
    );

    console.log("Built blog page");
}

// build all markdown posts
async function buildPosts() {
    console.log("Building posts...");

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const files = await fs.readdir(POSTS_DIR);
    const markdownFiles = files.filter(
        file => file.endsWith(".md") || file.endsWith(".markdown")
    );

    for (const file of markdownFiles) {
        const inputPath = path.join(POSTS_DIR, file);

        // parse markdown to html
        const markdown = await fs.readFile(inputPath, "utf8");
        const { data, content } = matter(markdown);
        const htmlContent = marked.parse(content);

        // get content metadata
        const filename = path.basename(file, path.extname(file));
        const slug = slugify(filename);

        const title = escapeHtml(data.title || "Untitled");
        const author = escapeHtml(data.author || "Unknown author");
        const date = escapeHtml(data.date || "");
        const description = escapeHtml(data.description || "");

        // create html
        const postTemplate = await fs.readFile(TEMPLATE_POST_PATH, "utf8");

        let html = postTemplate;
        html = html.replaceAll("{{title}}", data.title);
        html = html.replaceAll("{{author}}", data.author);
        html = html.replaceAll("{{date}}", formatDate(data.date));
        html = html.replaceAll("{{description}}", data.description);
        html = html.replaceAll("{{content}}", htmlContent);

        // write html file
        const outputPath = path.join(OUTPUT_DIR, `${slug}.html`);
        await fs.writeFile(outputPath, html);

        console.log(`${file} -> ${slug}.html`);
    }

    console.log(`Built ${markdownFiles.length} posts.`);
}

await buildBlog().catch(error => {
    console.error("Blog Build failed:");
    console.error(error);
    process.exit(1);
});

await buildPosts().catch(error => {
    console.error("Post Build failed:");
    console.error(error);
    process.exit(1);
});
