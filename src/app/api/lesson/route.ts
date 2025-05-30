import GetLessonService from "@/services/lesson";
export const maxDuration = 120;


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get("userEmail");
    const tech = url.searchParams.get("tech");
    const lessonName = url.searchParams.get("lessonName");
    const lessonId = url.searchParams.get("lessonId");
    if (!userEmail || !lessonId || !lessonName || !tech) {
      return new Response("Missing query params", { status: 400 });
    }
    const lessonService = await GetLessonService();
    const lesson = await lessonService.getUserLesson(userEmail, lessonId);
    if (!lesson) {
      const generetedLesson = await lessonService.generateLesson(
        tech,
        lessonName,
      ) as any;
      generetedLesson.userEmail = userEmail;
      generetedLesson.lessonId = lessonId;
      generetedLesson.completedTill = "";

      const savedLesson = await lessonService.saveUserLesson(generetedLesson);
      return Response.json(savedLesson);
    } else {
      return Response.json(lesson);
    }
  } catch (error) {
  console.log(error)
    return new Response("something went wrong", { status: 500 });
  }
}
