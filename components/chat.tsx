import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./chat.css";

interface MessageModel {
  role: string;
  content: string;
  name: string;
}

const ChatComponent = () => {
  const [messageEvents, setMessageEvents] = useState([]);

  const [token, setToken] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState<MessageModel[]>([]);
  const [input, setInput] = useState("");
  //   const [openSideSheet, setOpenSideSheet] = useState(false);

  const getToken = async () => {
    const response = await axios.get("/api/token");
    setToken(response.data.token);
  };

  useEffect(() => {
    getToken();
  }, []);

  const startConversation = async () => {
    const response = await axios.post("/api/conversation", { token });
    setConversationId(response.data.conversationId);
  };

  const sendMessage = async () => {
    const response = await axios.post("/api/message", {
      token,
      conversationId,
      message: input,
      user: "system",
    });
    setMsg((prevMessages) => [
      ...response.data.activities.map((activity: any) => ({
        role: activity.from.id,
        content: activity.text,
        name: activity.from.id,
      })),
    ]);
  };

  const sanitizeContent = (content: string) => {
    return content.replace(/<[^>]*>?/gm, "");
  };

  const sendUserMessage = async (content: string) => {
    const cleanContent = sanitizeContent(content);
    const response = await axios.post("/api/message", {
      token,
      conversationId,
      message: cleanContent,
      user: "user",
    });
    setMsg((prevMessages) => [
      ...response.data.activities.map((activity: any) => ({
        role: activity.from.id,
        content: activity.text,
        name: activity.from.id,
      })),
    ]);
  };

  console.log(11, msg);

  return (
    <div>
      {/* <button onClick={getToken}>Get Token</button> */}
      <button onClick={startConversation} className="ml-2">
        Start Conversation
      </button>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg["text"]}</div>
        ))}
      </div>

      {conversationId && (
        <>
          <div className="h-16">
            <div>Copilot</div>
          </div>
          <div style={{ position: "relative", height: "500px" }}>
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {msg.map((messageEvent, index) => {
                    switch (messageEvent.role) {
                      case "user":
                        return (
                          <Message
                            key={index}
                            model={{
                              message: messageEvent.content,
                              sentTime: "just now",
                              sender: messageEvent.name,
                              position: "single",
                              direction: "outgoing",
                            }}
                            avatarPosition="tr"
                          ></Message>
                        );
                      case "system":
                        return (
                          <Message
                            key={index}
                            model={{
                              message: messageEvent.content,
                              sentTime: "just now",
                              sender: messageEvent.name,
                              position: "single",
                              direction: "incoming",
                            }}
                            avatarPosition="tr"
                          ></Message>
                        );
                      case "initial":
                        return (
                          <Message
                            key={index}
                            model={{
                              message: messageEvent.content,
                              sentTime: "just now",
                              sender: messageEvent.name,
                              position: "single",
                              direction: "outgoing",
                            }}
                            avatarPosition="tl"
                          >
                            <Message.HtmlContent html={messageEvent.content} />
                          </Message>
                        );
                      default:
                        return null;
                    }
                  })}

                  <Message
                    model={{
                      message: "Hey, I am your Copilot",
                      sentTime: "just now",
                      sender: "Joe",
                      direction: "incoming",
                      position: "single",
                    }}
                  />
                  <Message
                    model={{
                      message:
                        "I am here to answer your question about Vertex product.",
                      sentTime: "just now",
                      sender: "Joe",
                      direction: "incoming",
                      position: "single",
                    }}
                  />
                </MessageList>
                <MessageInput
                  placeholder={"Type a message..."}
                  onSend={sendUserMessage}
                  attachButton={false}
                />
              </ChatContainer>
            </MainContainer>
          </div>
        </>
      )}

      {/* <button
        onClick={handleChatClick}
        className="text-sm font-semibold leading-6 p-2 text-gray-900 hover:text-gray-500 lg:ml-4"
      >
        Chat
      </button> */}

      {/* <Transition show={openSideSheet} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenSideSheet}>
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto relative w-screen max-w-md">
                    <TransitionChild
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpenSideSheet(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </TransitionChild>
                    <div className="flex h-full flex-col overflow-y-scroll bg-rose-50 py-4 shadow-xl">
                      <div className="px-4 sm:px-6 border-b pb-2 border-rose-300">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Chat
                        </DialogTitle>
                      </div>
                      <div className="relative flex-1">
                        <ChatScope />
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </div>
  );
};

export default ChatComponent;
