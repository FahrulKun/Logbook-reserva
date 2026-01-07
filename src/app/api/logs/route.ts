import { NextRequest, NextResponse } from 'next/server';

interface LogEntry {
  id: string;
  date: string;
  day: number;
  treatmentName: string;
  commission: number;
}

// Simulate database storage with in-memory storage
let logs: LogEntry[] = [];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, treatmentName, commission } = body;

    if (!date || !treatmentName || !commission) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const dateObj = new Date(date);
    const day = dateObj.getDay() === 0 ? 1 : dateObj.getDay() + 1; // Sunday = 1, Monday = 2, etc.

    const newLog: LogEntry = {
      id: Date.now().toString(),
      date,
      day,
      treatmentName,
      commission: parseInt(commission),
    };

    logs.unshift(newLog);

    return NextResponse.json({
      success: true,
      data: newLog
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create log' },
      { status: 500 }
    );
  }
}