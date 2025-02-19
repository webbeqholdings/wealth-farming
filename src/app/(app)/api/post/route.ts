import { NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { Media } from '@/collections/Media';
import { features } from 'process';

export async function POST(req: Request) {
  try {
    const { title, content, tags, category } = await req.json();
    const payload = await getPayloadHMR({ config });

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create a new post
    const newPost = await payload.create({
      collection: 'posts',
      data: {
        title: title,
        content: content,
        author: 1,
        category: category ?? 1,
        tags: tags,
        // featured_image: 60,
        relatedPosts: [
            {
              relatedPost: 1
            },
            {
              relatedPost: 2
            },
            {
              relatedPost: 3
            },
            {
              relatedPost: 4
            },
        ],
    }})

    // Return response with success
    return NextResponse.json({
      post: newPost,
      response: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

