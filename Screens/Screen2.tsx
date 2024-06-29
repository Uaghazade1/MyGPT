// App.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';
import axios, { AxiosError } from 'axios';
import { OPENAI_API_KEY } from './../config';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Screen2() {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <Text style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type your message..."
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
    marginTop: 100,
    backgroundColor: 'yellow'
  },
  messageContainer: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: 'green'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'blue',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white'
  },
});
