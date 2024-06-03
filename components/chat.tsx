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
import { useSocket } from "@/context/socket-context";

interface MessageModel {
  role: string;
  content: string;
  name: string;
}

const ChatComponent = () => {
  const { initializeSocket, socket } = useSocket();
  const [token, setToken] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [msg, setMsg] = useState<MessageModel[]>([]);
  const [openSideSheet, setOpenSideSheet] = useState(false);

  const getToken = async () => {
    const response = await axios.get("/api/token");
    setToken(response.data.token);
  };

  useEffect(() => {
    getToken();
  }, []);

  const startConversation = async () => {
    setOpenSideSheet(true);

    const response = await axios.post("/api/conversation", { token });
    setConversationId(response.data.conversationId);
    setStreamUrl(response.data.streamUrl);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("conversationId", response.data.conversationId);
    initializeSocket(response.data.streamUrl);
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: any) => {
        if (event.data) {
          const message = JSON.parse(event.data);

          setMsg((prevMessages) => [
            ...prevMessages,
            ...message.activities.map((activity: any) => ({
              role: activity.from.id,
              content: activity.text,
              name: activity.from.id,
            })),
          ]);
        }
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

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
  };

  return (
    <div className="mx-2 flex items-center">
      <button
        type="button"
        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={startConversation}
      >
        Start Conversation
      </button>

      <Transition show={openSideSheet} as={Fragment}>
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
                    <div className="flex h-full flex-col overflow-y-scroll bg-[#c0e8ef] shadow-xl">
                      <div className="px-4 sm:px-6 py-2 flex items-center justify-between">
                        <div>
                          <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                            Copilot
                          </DialogTitle>
                          <div className="text-sm font-semibold text-gray-900">
                            Today
                          </div>
                        </div>

                        <div className="flex items-center">
                          <button
                            type="button"
                            className="relative rounded-md text-black hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
                            onClick={() => setOpenSideSheet(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="relative flex-1">
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
                                        <Message.HtmlContent
                                          html={messageEvent.content}
                                        />
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
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ChatComponent;
