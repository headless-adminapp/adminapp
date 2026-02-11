import { isHttpError } from '@headless-adminapp/core/transport';
import { NextResponse } from 'next/server';

export function formatResponseError(error: unknown) {
  if (isHttpError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      {
        status: error.status,
      },
    );
  } else {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        },
      },
      {
        status: 500,
      },
    );
  }
}
