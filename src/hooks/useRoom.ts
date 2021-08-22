import { useEffect, useState } from "react";
import { database } from "services/firebase";
import { useAuth } from "./useAuth";

export type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>;

export function useRoom(roomId: string ) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [endedAt, setEndedAt] = useState<string | undefined>(undefined);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom?.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      });
      
      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
      setAuthorId(databaseRoom.authorId);
      setEndedAt(databaseRoom.endedAt)
    });

    return () => {
      roomRef.off('value');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user?.id]);

  return { questions, title, authorId, endedAt }
}