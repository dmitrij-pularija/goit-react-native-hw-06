import Moment from "moment";
import "moment/locale/ru";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { selectComments } from "../../redux/data/selectors";
import { createComment, getComments } from "../../redux/data/operations";
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./Comments.styles.js";

const Comments = ({
  route: {
    params: { postId, uri },
  },
}) => {
  Moment.locale("ru");
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const user = useSelector(selectUser);
  const commentHandler = (value) => setComment(value);
  const handleSend = () => {
    if (comment.length < 5)
      return Alert.alert("Please enter a comment with at least 5 characters");
    const currentDate = Moment().format("DD.MM.YYYY");
    const currentTime = Moment().format("HH:mm");
    const { userId, photoURL } = user;
    dispatch(
      createComment({
        postId,
        userId,
        photoURL,
        comment,
        timeStamp: `${currentDate} | ${currentTime}`,
      })
    );
    setComment("");
    dispatch(getComments());
  };
  const comments = useSelector(selectComments);
  const commentsFiltred = comments.filter(
    (comment) => comment.postId === postId
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image style={styles.image} source={{ uri }} />
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.list}
          data={commentsFiltred}
          renderItem={({ item }) => (
            <View
              style={{
                ...styles.item,
                flexDirection:
                  item.userId === user.userId ? "row-reverse" : "row",
              }}
            >
              <View style={styles.avatarBox}>
                <Image style={styles.avatar} source={{ uri: item.photoURL }} />
              </View>
              <View
                style={
                  item.userId === user.userId
                    ? styles.ownerComment
                    : styles.guestComment
                }
              >
                <Text style={styles.coment}>{item.comment}</Text>
                <Text
                  style={{
                    ...styles.data,
                    textAlign: item.userId === user.userId ? "left" : "right",
                  }}
                >
                  {item.timeStamp}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.comentId}
        />
      </SafeAreaView>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          onChangeText={commentHandler}
          placeholder="Comment..."
          value={comment}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btnSend}
          onPress={handleSend}
        >
          <Feather name="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comments;