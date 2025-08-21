import { StudentAssessmentRecord, TeacherAssessmentRecord } from "@/types";
import { Account, Client, Databases, Query, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

// Database and collection IDs
export const RUBRICS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_TEACHER_ASSESSMENT || "";
const STUDENT_ASSESSMENT_COLLECTION_ID =
  process.env.NEXT_PUBLIC_STUDENT_ASSESSMENT_ID;

export const getTeacherStudentAssessments = async (
  grade: string
): Promise<TeacherAssessmentRecord[]> => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collectionId = RUBRICS_COLLECTION_ID;

    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!collectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_RUBRICS_COLLECTION_ID in your environment variables."
      );
    }

    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("grade", grade),
      Query.limit(100),
    ]);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      teacherId: doc.teacherId,
      teacherName: doc.teacherName,
      school: doc.school,
      grade: doc.grade,
      section: doc.section,
      date: doc.date,
      studentName: doc.studentName,
      assessment: doc.assessment,
      isManualEntry: doc.isManualEntry,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

export const getParentStudentAssessments = async (
  grade: string
): Promise<StudentAssessmentRecord[]> => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collectionId = STUDENT_ASSESSMENT_COLLECTION_ID;

    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!collectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_RUBRICS_COLLECTION_ID in your environment variables."
      );
    }

    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("grade", grade),
      Query.limit(100),
    ]);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      school: doc.school,
      grade: doc.grade,
      section: doc.section,
      studentName: doc.studentName,
      parentQuestionnaire: doc.parentQuestionnaire,
      assessment: doc.assessment,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};
