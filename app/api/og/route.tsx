import { ImageResponse } from "@vercel/og";
import { cvService } from "@/lib/services/cv-service";
import { getBaseUrl } from "@/lib/env";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return new Response("Missing username parameter", { status: 400 });
    }

    const cv = await cvService.getCVByUsername(username);

    if (!cv) {
      return new Response("CV not found", { status: 404 });
    }

    const technologies = cv.technologies.slice(0, 5).join(" • ");

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            backgroundImage: "radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "40px 80px",
          }}
        >
          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#18181b",
              border: "2px solid #27272a",
              borderRadius: "24px",
              padding: "60px",
              width: "100%",
              maxWidth: "1040px",
            }}
          >
            {/* Avatar Circle */}
            {cv.avatar && (
              <div
                style={{
                  display: "flex",
                  width: "120px",
                  height: "120px",
                  borderRadius: "60px",
                  backgroundColor: "#3f3f46",
                  border: "4px solid #52525b",
                  marginBottom: "32px",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${getBaseUrl()}${cv.avatar}`}
                  alt={cv.fullName}
                  width="120"
                  height="120"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Name */}
            <div
              style={{
                display: "flex",
                fontSize: "56px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {cv.fullName}
            </div>

            {/* Title */}
            <div
              style={{
                display: "flex",
                fontSize: "36px",
                color: "#a1a1aa",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              {cv.title}
            </div>

            {/* Technologies */}
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                color: "#71717a",
                marginBottom: "40px",
                textAlign: "center",
                maxWidth: "900px",
              }}
            >
              {technologies}
            </div>

            {/* CTA Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "28px",
                  color: "#ffffff",
                  fontWeight: "600",
                }}
              >
                View Full CV
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "24px",
                  color: "#71717a",
                }}
              >
                →
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "24px",
                  color: "#a1a1aa",
                }}
              >
                cv-galaxy.vercel.app/{username}
              </div>
            </div>
          </div>

          {/* Logo Badge */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "40px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#18181b",
              border: "2px solid #27272a",
              borderRadius: "12px",
              padding: "16px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "28px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              CV Galaxy
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    );

    return imageResponse;
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
