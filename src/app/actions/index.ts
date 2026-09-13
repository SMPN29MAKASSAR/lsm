'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- USERS ---
export async function getUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { role: 'asc' } });
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: { id: string; name: string; role: string; kelas?: string; mapel?: string }) {
  try {
    await prisma.user.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createUsers(usersData: { id: string; name: string; role: string; kelas?: string; mapel?: string }[]) {
  try {
    // We can use a transaction for safety, or just loop
    await prisma.$transaction(
      usersData.map((data) =>
        prisma.user.upsert({
          where: { id: data.id },
          update: data,
          create: data,
        })
      )
    );
    revalidatePath('/');
    return { success: true, count: usersData.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUsers(ids: string[]) {
  try {
    await prisma.user.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    revalidatePath('/');
    return { success: true, count: ids.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function seedUsers() {
  const defaults = [
    { id: '123456', role: 'siswa', name: 'Budi Santoso', kelas: 'X MIPA 1', mapel: '' },
    { id: 'NIP001', role: 'guru', name: 'Drs. Akhmad', kelas: '', mapel: 'Matematika' },
    { id: 'ADMIN', role: 'admin', name: 'Admin Tata Usaha', kelas: '', mapel: '' },
    { id: 'KEPSEK', role: 'kepsek', name: 'Kepala Sekolah', kelas: '', mapel: '' }
  ];
  try {
    for (const u of defaults) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: u,
        create: u,
      });
    }
    revalidatePath('/');
  } catch (e) {
    console.error(e);
  }
}

// --- SCHEDULES ---
export async function getSchedules() {
  try {
    return await prisma.schedule.findMany({ orderBy: { date: 'asc' } });
  } catch (e) {
    return [];
  }
}

export async function createSchedule(data: { teacherId: string; teacherName: string; mapel: string; kelas: string; date: string }) {
  try {
    const s = await prisma.schedule.create({ data });
    revalidatePath('/');
    return { success: true, schedule: s };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSchedules(schedulesData: any[]) {
  try {
    await prisma.schedule.createMany({
      data: schedulesData
    });
    revalidatePath('/');
    return { success: true, count: schedulesData.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSchedule(id: string, data: any) {
  try {
    await prisma.schedule.update({ where: { id }, data });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSchedule(id: string) {
  try {
    await prisma.schedule.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- ATTENDANCE ---
export async function getAttendances() {
  try {
    return await prisma.attendance.findMany();
  } catch (e) {
    return [];
  }
}

export async function markAttendance(scheduleId: string, userId: string, time: string, method: string) {
  try {
    await prisma.attendance.upsert({
      where: { scheduleId_userId: { scheduleId, userId } },
      update: { time, method },
      create: { scheduleId, userId, time, method },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- SUBMISSIONS ---
export async function getSubmissions() {
  try {
    return await prisma.submission.findMany();
  } catch (e) {
    return [];
  }
}

export async function createSubmission(scheduleId: string, userId: string, text: string, fileName?: string, fileUrl?: string) {
  try {
    await prisma.submission.upsert({
      where: { scheduleId_userId: { scheduleId, userId } },
      update: { text, fileName, fileUrl },
      create: { scheduleId, userId, text, fileName, fileUrl },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- JOURNALS ---
export async function getJournals() {
  try {
    return await prisma.journal.findMany();
  } catch (e) {
    return [];
  }
}

export async function saveJournal(id: string, text: string, photoUrls?: string[]) {
  try {
    await prisma.journal.upsert({
      where: { id },
      update: { text, ...(photoUrls ? { photoUrls } : {}) },
      create: { id, text, photoUrls: photoUrls || [] },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
