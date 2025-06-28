import { NextRequest, NextResponse } from "next/server";

// Types for the API
interface BulkVerificationRequest {
  name?: string;
  emails: string[];
  key?: string;
}

interface BulkVerificationResponse {
  status: string;
  task_id?: number;
  count_submitted?: number;
  count_duplicates_removed?: number;
  count_rejected_emails?: number;
  count_processing?: number;
  reason?: string;
}

interface EmailVerificationResult {
  can_connect_smtp: boolean;
  domain: string;
  email: string;
  has_inbox_full: boolean;
  is_catch_all: boolean;
  is_deliverable: boolean;
  is_disabled: boolean;
  is_disposable: boolean;
  is_role_account: boolean;
  is_safe_to_send: boolean;
  is_spamtrap: boolean | null;
  is_valid_syntax: boolean;
  mx_accepts_mail: boolean;
  mx_records: string[];
  status: string;
  username: string;
}

interface BulkVerificationResult {
  task_id: string;
  name: string;
  status: string;
  count_total: number;
  count_checked: number;
  progress_percentage: number;
  results?: Record<string, EmailVerificationResult>;
}

// API Routes
export async function POST(request: NextRequest) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_REOON_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { status: "error", reason: "API key not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body: BulkVerificationRequest = await request.json();

    // Validate request body
    if (!body.emails || !Array.isArray(body.emails)) {
      return NextResponse.json(
        {
          status: "error",
          reason: "Invalid request body: emails array is required",
        },
        { status: 400 }
      );
    }

    // Add API key to request body
    const payload = {
      ...body,
      key: apiKey,
    };

    // Make request to Reoon API
    const response = await fetch(
      "https://emailverifier.reoon.com/api/v1/create-bulk-verification-task/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data: BulkVerificationResponse = await response.json();

    // Return response with appropriate status code
    return NextResponse.json(data, {
      status: response.ok ? 201 : response.status,
    });
  } catch (error) {
    console.error("Bulk verification error:", error);
    return NextResponse.json(
      { status: "error", reason: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_REOON_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { status: "error", reason: "API key not configured" },
        { status: 500 }
      );
    }

    // Get email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { status: "error", reason: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Make request to Reoon API
    const apiUrl = `https://emailverifier.reoon.com/api/v1/verify?email=${encodeURIComponent(email)}&key=${apiKey}&mode=power`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("API Response:", errorData);
      throw new Error("Failed to verify email");
    }

    const data = await response.json();

    // Return response with appropriate status code
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { status: "error", reason: "Failed to verify email address" },
      { status: 500 }
    );
  }
}
