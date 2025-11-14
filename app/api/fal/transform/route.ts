import { fal } from '@fal-ai/client';
import { NextRequest, NextResponse } from 'next/server';

const FAL_API_KEY = process.env.FAL_API_KEY_ATHAR_ONLY;

if (!FAL_API_KEY) {
  console.error('❌ [FAL] Missing FAL_API_KEY_ATHAR_ONLY environment variable');
}

// Configure FAL client
if (FAL_API_KEY) {
  fal.config({
    credentials: FAL_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!FAL_API_KEY) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { photo, bio } = body;

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo is required' },
        { status: 400 }
      );
    }

    if (!bio) {
      return NextResponse.json(
        { error: 'Bio is required' },
        { status: 400 }
      );
    }

    // Convert base64 photo to Blob
    let imageBlob: Blob;
    try {
      // Remove data URL prefix if present
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      // Convert Buffer to Blob
      imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    console.log('📸 [FAL] Uploading user image to FAL storage...');

    // Upload image to FAL storage
    const imageUrl = await fal.storage.upload(imageBlob);

    if (!imageUrl) {
      throw new Error('No image URL returned from upload');
    }

    console.log('📸 [FAL] Image uploaded, generating transformation...');

    // Build FAL prompt with bio text
    const falPrompt = `Using Image 1 as the Base, keep this exact person's identity, facial features, skin tone, hairstyle, and body shape unchanged. Transform them into a Grand Theft Auto V loading-screen style character illustration, and ensure they are smiling naturally. Use ${bio} only for personality, outfit direction, and background cues. DO NOT show any text, words, letters, or borders around text in the image. The bio text should NEVER appear visually in the image. Apply a controlled palette using Cordovan #8B2C3D, Dark Slate Gray #335C67, Linen #F5E8DC, Bittersweet #F97068, and Black #060404 across clothing accents, shadows, props, and the simplified GTA-style gradient backdrop. Use bold cel-shaded outlines, crisp shadows, saturated color blocks, and a medium full-body or three-quarter shot at a subtle low angle. Maintain the lighting direction, color temperature, and overall mood from Image 1. Do not add new people, text, logos, borders, or explicit weapons; if the bio suggests danger, reflect it through attitude and environment while keeping the smile present. Identity must remain perfectly consistent with Image 1, with no warping, seams, or mismatched shadows. Output one high-resolution image in 16:9 aspect ratio.`;

    // Call FAL AI for image transformation
    // Use only aspect_ratio - image_size might override it
    const result = await fal.run('fal-ai/nano-banana/edit', {
      input: {
        prompt: falPrompt,
        image_urls: [imageUrl],
        aspect_ratio: '16:9',
      },
    });

    // Extract the generated image URL
    const generatedImageUrl = result.data.images?.[0]?.url;
    if (!generatedImageUrl) {
      console.error('No image URL in FAL result:', result.data);
      throw new Error('AI generation failed - no image produced');
    }

    console.log('✅ [FAL] Image generated successfully');

    // Download the generated image
    const imageResponse = await fetch(generatedImageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to retrieve generated image');
    }

    const generatedImageBlob = await imageResponse.blob();
    const imageArrayBuffer = await generatedImageBlob.arrayBuffer();

    // Return the image as base64
    const base64Image = Buffer.from(imageArrayBuffer).toString('base64');
    const dataUrl = `data:${generatedImageBlob.type};base64,${base64Image}`;

    return NextResponse.json({
      image: dataUrl,
      imageUrl: generatedImageUrl,
    });
  } catch (error) {
    console.error('❌ [FAL] Error transforming image:', error);
    return NextResponse.json(
      {
        error: 'Failed to transform image',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

