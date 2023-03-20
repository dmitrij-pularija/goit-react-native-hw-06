import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/config";
import {
    doc,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    arrayUnion,
    query,
    where,
  } from "firebase/firestore";
  
export const createPost = createAsyncThunk(
  "data/createPost",
  async ({ author, uri, name, adress, coordinate }, { rejectWithValue }) => {
    try {
      await addDoc(collection(db, "posts"), {
        author,
        uri,
        name,
        adress,
        coordinate,
        likes: [],
      });
    } catch ({ response }) {
      return rejectWithValue(response);
    }
  }
);

export const getPosts = createAsyncThunk(
  "data/getPosts",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      return querySnapshot.docs.map((doc) => ({
        postId: doc.id,
        ...doc.data(),
      }));
    } catch ({ response }) {
      return rejectWithValue(response);
    }
  }
);

export const createComment = createAsyncThunk(
  "data/createComment",
  async (
    { postId, userId, photoURL, comment, timeStamp },
    { rejectWithValue }
  ) => {
    try {
      await addDoc(collection(db, "comments"), {
        postId,
        userId,
        photoURL,
        comment,
        timeStamp,
      });
    } catch ({ response }) {
      return rejectWithValue(response);
    }
  }
);

export const getComments = createAsyncThunk(
  "data/getComments",
  async (postId, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        comentId: doc.id,
        ...doc.data(),
      }));
    } catch ({ response }) {
      return rejectWithValue(response);
    }
  }
);

export const addLike = createAsyncThunk(
  "data/addLike",
  async ({ postId, userId }, { rejectWithValue }) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { likes: arrayUnion(userId) });
    } catch ({ response }) {
      return rejectWithValue(response);
    }
  }
);