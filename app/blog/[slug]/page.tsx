import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/lib/posts";
import { metaData } from "app/config";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
/* No funciono, lo dio deepseek
export async function generateStaticParams() {
  // ✅ 1. Agrega try-catch
  try {
    let posts = getBlogPosts();
    
    // ✅ 2. Verifica que posts existe
    if (!posts) {
      return []; // Array vacío en lugar de error
    }
    
    return posts
      .filter(post => post && post.slug) // ✅ 3. Filtra posts válidos
      .map((post) => ({
        slug: post.slug,
      }));
      
  } catch (error) {
    // ✅ 4. Captura cualquier error
    return []; // 🟢 SIEMPRE retorna array vacío
  }
}
*/

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${metaData.baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${metaData.baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }
  function escapeHtml(unsafe: string) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderSimpleMDX(text: string) {
    return text
      .split(/\r?\n/)
      .map((line) => {
        if (line.startsWith("## ")) {
          return `<h2 class="text-3xl font-semibold mt-6 mb-4">${escapeHtml(
            line.slice(3)
          )}</h2>`;
        }
        if (line.startsWith("# ")) {
          return `<h1 class="text-4xl font-bold mt-6 mb-4">${escapeHtml(
            line.slice(2)
          )}</h1>`;
        }
        if (line.trim() === "") return "";
        return `<p>${escapeHtml(line)}</p>`;
      })
      .join("\n");
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${metaData.baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${metaData.baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: metaData.name,
            },
          }),
        }}
      />
      <h1 className="title mb-3 font-medium text-2xl tracking-tight">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-medium">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <div
          className="prose-lg"
          dangerouslySetInnerHTML={{ __html: renderSimpleMDX(post.content) }}
        />
      </article>
    </section>
  );
}
