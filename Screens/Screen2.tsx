// App.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import axios, { AxiosError } from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { OPENAI_API_KEY } from './../config';
import { AntDesign } from '@expo/vector-icons';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined;
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages([...messages, userMessage]);

    try {
      console.log('Sending request to OpenAI API');
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: inputText }],
          max_tokens: 50,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      console.log('Received response from OpenAI API:', response.data);
      const botMessage: Message = { sender: 'bot', text: response.data.choices[0].message.content.trim() };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error('Axios error communicating with OpenAI API:', error.response ? error.response.data : error.message);
        alert('There was an issue with the API request. Please check your quota and billing details.');
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    }

    setInputText('');
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS !== 'web' ? 'padding' : 'height'}>
         
            <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
              {messages.map((message, index) => (
                <View key={index} style={styles.messageContainer}>
                  <Text style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
                    {message.text}
                  </Text>
                </View>
              ))}
            </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="gray"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <AntDesign name="right" size={24} color="white" />           
             </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    paddingTop: 10,
    height: 100
  },
 
  scrollViewContent: {
    flexGrow: 1,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    marginTop: 70,
    marginBottom: 40
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    padding: 10,
    color: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    padding: 10,
    color: 'yellow',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
    bottom: 20
  },
  input: {
    flex: 1,
    height: 40,
    color: 'white'
  },
  sendButton: {
    backgroundColor: '#252525',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
});
