import { Score } from "@/types";
import { TeacherSurvey } from "@/utils/data";
import {
  Account,
  Client,
  Databases,
  OAuthProvider,
  Query,
  Storage,
} from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

export const loginWithGoogle = async (
  successUrl: string,
  failureUrl: string
) => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );
  } catch (error) {
    console.error("Google login failed:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

export const getScores = async ({
  school,
  grade,
  assessment,
}: {
  school: string;
  grade: string;
  assessment: "child" | "teacher_report" | "parent";
}): Promise<Score[]> => {
  const agg = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID!,
    [
      Query.equal("school", school),
      Query.equal("grade", grade),
      Query.equal("assessment", assessment),
    ]
  );

  const documents = agg.documents;

  return documents.map((doc) => ({
    $id: doc.$id,
    school: doc.school,
    grade: doc.grade,
    assessment: doc.assessment,
    total_students: doc.total_students,
    testType: doc.testType,
    overall_level_distribution: JSON.parse(doc.overall_level_distribution),
    category_level_distributions: JSON.parse(doc.category_level_distributions),
  }));
};

export const getTeacherSurveys = async (): Promise<TeacherSurvey> => {
  return fetch(process.env.NEXT_PUBLIC_TEACHER_SURVEY_API!)
    .then((res) => res.json())
    .then((data) => data);
};
