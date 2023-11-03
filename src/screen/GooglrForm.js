import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { CheckBox } from "react-native-elements";
import NavigationString from "../constant/NavigationString";
import { useMyContext } from "../../context/GlobalContextProvider";

const GoogleForm = () => {
  const [formResponses, setFormResponses] = useState([]);
  const [questions, setQuestions] = useState([]); 
const {ans,setAns,setIsSubmited}=useMyContext()
  const getQuestion = async () => {
    await axios.get("http://15.206.166.191/question").then((response) => {
      setQuestions(response?.data?.data);
      console.log("response?.data", response?.data?.data);
    });
  };
  // console.log("questions", questions);

  const handleCheckBoxChange = (titleId, questionId, optionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((questionGroup) => {
        if (questionGroup.id === titleId) {
          const updatedData = questionGroup.data.map((question) => {
            if (question.id === questionId) {
              const updatedSelectedOptions = question.options.map((option, index) => {
                return index === optionIndex;
              });
              return { ...question, selectedOptions: updatedSelectedOptions };
            }
            return question;
          });
          return { ...questionGroup, data: updatedData };
        }
        return questionGroup;
      });
      return updatedQuestions;
    });
  };


  // const handleCheckBoxChange = (titleId, questionId, optionIndex) => {
  //   setQuestions((prevQuestions) => {
  //     const updatedQuestions = prevQuestions.map((questionGroup) => {
  //       if (questionGroup.id === titleId) {
  //         const updatedData = questionGroup.data.map((question) => {
  //           if (question.id === questionId) {
  //             const updatedSelectedOptions = [...question.selectedOptions];
  //             updatedSelectedOptions[optionIndex] =
  //               !updatedSelectedOptions[optionIndex];
  //             return { ...question, selectedOptions: updatedSelectedOptions };
  //           }
  //           return question;
  //         });
  //         return { ...questionGroup, data: updatedData };
  //       }
  //       return questionGroup;
  //     });
  //     return updatedQuestions;
  //   });
  // };
const navigation = useNavigation()
const handleSubmit = () => {
  // Create an array of objects to store user responses in the desired format
  const formattedResponses = questions.map((questionGroup) => {
    return {
      [questionGroup.title]: questionGroup.data.map((question) => ({
        question: question.question,
        answer: question.options[
          question.selectedOptions.findIndex((option) => option === true)
        ] || "Not answered",
      })),
    };
  });

  // Now you have user responses in the desired format
  // console.log("Formatted Responses:", formattedResponses);
  setAns(formattedResponses)
  setIsSubmited(true)
  // Send 'formattedResponses' to your server or perform any other necessary actions

  // Navigate to the 'Thankyou' screen
  // navigation.navigate(NavigationString.Thankyou);
};

  useEffect(() => {
    getQuestion();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 40, paddingHorizontal: 10 }}
    >
      {questions.map((questionGroup) => (
        <View key={questionGroup.id}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {questionGroup.title}
          </Text>
          {questionGroup.data.map((question, index) => (
            <View key={question.id}>
              <Text>
                {++index}. {question.question}
              </Text>
              <ScrollView
                horizontal
                style={{ flexDirection: "row" }}
                showsHorizontalScrollIndicator={false}
              >
                {question.options.map((option, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <CheckBox
                      checked={question.selectedOptions[index]}
                      onPress={() =>
                        handleCheckBoxChange(
                          questionGroup.id,
                          question.id,
                          index
                        )
                      }
                    />
                    <Text>{option}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default GoogleForm;
