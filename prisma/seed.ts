import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@fyb.com" },
    update: {},
    create: {
      email: "admin@fyb.com",
      passwordHash,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "User",
      onboarded: true,
    },
  });
  console.log("Created admin:", admin.email);

  // Parent users
  const parent1 = await prisma.user.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      email: "sarah@example.com",
      passwordHash,
      role: "PARENT",
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "(555) 123-4567",
      onboarded: true,
    },
  });

  const parent2 = await prisma.user.upsert({
    where: { email: "mike@example.com" },
    update: {},
    create: {
      email: "mike@example.com",
      passwordHash,
      role: "PARENT",
      firstName: "Mike",
      lastName: "Chen",
      phone: "(555) 234-5678",
      onboarded: true,
    },
  });

  console.log("Created parents:", parent1.email, parent2.email);

  // Babysitter users
  const sitter1 = await prisma.user.upsert({
    where: { email: "emma@example.com" },
    update: {},
    create: {
      email: "emma@example.com",
      passwordHash,
      role: "BABYSITTER",
      firstName: "Emma",
      lastName: "Wilson",
      phone: "(555) 345-6789",
      onboarded: true,
    },
  });

  await prisma.babysitterProfile.upsert({
    where: { userId: sitter1.id },
    update: {},
    create: {
      userId: sitter1.id,
      bio: "Experienced babysitter with a passion for childcare. I have been working with children of all ages for over 5 years. I love creative play, reading, and outdoor activities. CPR and First Aid certified.",
      hourlyRate: 22,
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      radiusMiles: 15,
      yearsExperience: 5,
      languages: "English,Spanish",
      ageRangeMin: 0,
      ageRangeMax: 12,
      hasFirstAid: true,
      hasCPR: true,
      hasTransportation: true,
      availabilityJson: JSON.stringify({
        monday: ["morning", "afternoon"],
        tuesday: ["morning", "afternoon", "evening"],
        wednesday: ["afternoon", "evening"],
        thursday: ["morning", "afternoon"],
        friday: ["afternoon", "evening"],
        saturday: ["morning", "afternoon", "evening"],
        sunday: ["morning", "afternoon"],
      }),
    },
  });

  const sitter2 = await prisma.user.upsert({
    where: { email: "james@example.com" },
    update: {},
    create: {
      email: "james@example.com",
      passwordHash,
      role: "BABYSITTER",
      firstName: "James",
      lastName: "Martinez",
      phone: "(555) 456-7890",
      onboarded: true,
    },
  });

  await prisma.babysitterProfile.upsert({
    where: { userId: sitter2.id },
    update: {},
    create: {
      userId: sitter2.id,
      bio: "College student studying Early Childhood Education. I genuinely enjoy working with kids and helping them learn through play. Patient, responsible, and always on time.",
      hourlyRate: 18,
      city: "San Francisco",
      state: "CA",
      zipCode: "94110",
      radiusMiles: 10,
      yearsExperience: 3,
      languages: "English",
      ageRangeMin: 2,
      ageRangeMax: 10,
      hasFirstAid: true,
      hasCPR: false,
      hasTransportation: false,
      availabilityJson: JSON.stringify({
        monday: ["evening"],
        tuesday: ["evening"],
        wednesday: ["afternoon", "evening"],
        thursday: ["evening"],
        friday: ["afternoon", "evening"],
        saturday: ["morning", "afternoon", "evening"],
        sunday: ["morning", "afternoon", "evening"],
      }),
    },
  });

  const sitter3 = await prisma.user.upsert({
    where: { email: "olivia@example.com" },
    update: {},
    create: {
      email: "olivia@example.com",
      passwordHash,
      role: "BABYSITTER",
      firstName: "Olivia",
      lastName: "Kim",
      phone: "(555) 567-8901",
      onboarded: true,
    },
  });

  await prisma.babysitterProfile.upsert({
    where: { userId: sitter3.id },
    update: {},
    create: {
      userId: sitter3.id,
      bio: "Professional nanny with 8 years of experience working with families. Specialized in infant and toddler care. Background in child psychology. I create structured, nurturing environments for children to thrive.",
      hourlyRate: 30,
      city: "San Francisco",
      state: "CA",
      zipCode: "94115",
      radiusMiles: 20,
      yearsExperience: 8,
      languages: "English,Korean",
      ageRangeMin: 0,
      ageRangeMax: 6,
      hasFirstAid: true,
      hasCPR: true,
      hasTransportation: true,
      availabilityJson: JSON.stringify({
        monday: ["morning", "afternoon", "evening"],
        tuesday: ["morning", "afternoon", "evening"],
        wednesday: ["morning", "afternoon", "evening"],
        thursday: ["morning", "afternoon", "evening"],
        friday: ["morning", "afternoon"],
        saturday: [],
        sunday: [],
      }),
    },
  });

  console.log("Created sitters:", sitter1.email, sitter2.email, sitter3.email);

  // Create a sample childcare request
  const request1 = await prisma.childcareRequest.upsert({
    where: { id: "sample-request-1" },
    update: {},
    create: {
      id: "sample-request-1",
      parentId: parent1.id,
      title: "Weeknight sitter needed for two kids",
      description: "Looking for a reliable sitter for Tuesday evening. Kids are well-behaved and love reading and board games. We have a friendly dog.",
      dateNeeded: new Date("2026-03-15"),
      startTime: "17:00",
      endTime: "21:00",
      durationHours: 4,
      numberOfChildren: 2,
      childrenJson: JSON.stringify([
        { name: "Lily", age: 4 },
        { name: "Noah", age: 7 },
      ]),
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      maxHourlyRate: 25,
      specialNotes: "We have a friendly golden retriever. Kids eat dinner at 6pm.",
      status: "OPEN",
    },
  });

  console.log("Created sample request:", request1.title);

  // Create a booking
  const booking1 = await prisma.booking.upsert({
    where: { id: "sample-booking-1" },
    update: {},
    create: {
      id: "sample-booking-1",
      requestId: request1.id,
      parentId: parent1.id,
      sitterId: sitter1.id,
      dateBooked: new Date("2026-03-15"),
      startTime: "17:00",
      endTime: "21:00",
      agreedRate: 22,
      totalEstimated: 88,
      status: "CONFIRMED",
    },
  });

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        bookingId: booking1.id,
        senderId: parent1.id,
        content: "Hi Emma! Thanks for accepting. The kids are excited to meet you!",
        isRead: true,
      },
      {
        bookingId: booking1.id,
        senderId: sitter1.id,
        content: "Hi Sarah! I'm looking forward to it. Should I bring any activities or games?",
        isRead: true,
      },
      {
        bookingId: booking1.id,
        senderId: parent1.id,
        content: "That would be great! They love arts and crafts. We have supplies at home too.",
        isRead: false,
      },
    ],
  });

  console.log("Created sample booking and messages");

  // Create a completed booking with review
  const request2 = await prisma.childcareRequest.upsert({
    where: { id: "sample-request-2" },
    update: {},
    create: {
      id: "sample-request-2",
      parentId: parent2.id,
      title: "Saturday afternoon sitter",
      description: "Need someone for a few hours on Saturday afternoon while we run errands.",
      dateNeeded: new Date("2026-03-01"),
      startTime: "13:00",
      endTime: "17:00",
      durationHours: 4,
      numberOfChildren: 1,
      childrenJson: JSON.stringify([{ name: "Ava", age: 3 }]),
      city: "San Francisco",
      state: "CA",
      zipCode: "94110",
      status: "CLOSED",
    },
  });

  const booking2 = await prisma.booking.upsert({
    where: { id: "sample-booking-2" },
    update: {},
    create: {
      id: "sample-booking-2",
      requestId: request2.id,
      parentId: parent2.id,
      sitterId: sitter1.id,
      dateBooked: new Date("2026-03-01"),
      startTime: "13:00",
      endTime: "17:00",
      agreedRate: 22,
      totalEstimated: 88,
      status: "REVIEWED",
    },
  });

  await prisma.review.upsert({
    where: { bookingId: booking2.id },
    update: {},
    create: {
      bookingId: booking2.id,
      authorId: parent2.id,
      subjectId: sitter1.id,
      rating: 5,
      title: "Amazing babysitter!",
      comment: "Emma was fantastic with our daughter. She was punctual, engaged, and Ava had a blast. We will definitely book again!",
    },
  });

  console.log("Created completed booking with review");
  console.log("\n--- Seed complete ---");
  console.log("Login credentials (all accounts): password123");
  console.log("Admin: admin@fyb.com");
  console.log("Parents: sarah@example.com, mike@example.com");
  console.log("Sitters: emma@example.com, james@example.com, olivia@example.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
