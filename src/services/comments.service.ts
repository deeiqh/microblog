export class CommentsService {
  // static async retrieveComment(commentId: string): Promise<RetrieveCommentDto> {
  //   const comment = await prisma.comment.findUnique({
  //     where: {
  //       uuid: commentId,
  //     },
  //   });
  //   if (!comment) {
  //     throw new NotFound("Comment not found");
  //   }
  //   console.log(comment);
  //   return plainToInstance(RetrieveCommentDto, comment);
  // }
  // static async updateOwnComment(
  //   userId: string,
  //   commentId: string
  // ): Promise<void> {
  //   const updated = await prisma.comment.findUnique({
  //     where: {
  //       uuid: commentId,
  //     },
  //     select: {
  //       user_id: true,
  //     },
  //   });
  // }
}
