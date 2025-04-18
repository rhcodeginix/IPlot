import Button from "@/components/common/button";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
const Chatbot: React.FC = () => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.defer = true;
    script.setAttribute("chatbotId", "YbrgBkNnNWTkrRpQ23myI");
    script.setAttribute("domain", "www.chatbase.co");
    document.body.appendChild(script);

    const configScript = document.createElement("script");
    configScript.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "YbrgBkNnNWTkrRpQ23myI",
        domain: "www.chatbase.co"
      }
    `;
    document.body.appendChild(configScript);

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  return (
    <>
      {router.pathname !== "/add-plot" && isVisible && (
        <div
          className="fixed bottom-[12px] left-[12px] bg-white w-[240px] sm:w-[284px] border-gray3 rounded-[12px] p-4"
          style={{
            zIndex: 9999999999,
            boxShadow:
              "0px -4px 12px -2px #1018281A, 0px 12px 16px -4px #1018281F",
          }}
          id="addPlot"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-primary text-xl"
          >
            ⨯
          </button>
          <h4 className="text-[#4A5578] text-sm mb-3">
            <span className="font-bold">Har du en tomt du vil selge?</span>{" "}
            Markedsfør den <span className="font-bold underline">gratis</span>{" "}
            på mintomt.no!
          </h4>
          <Button
            text="Markedsfør tomten din nå"
            className="border border-greenBtn bg-greenBtn text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
            onClick={() => router.push("/add-plot")}
          />
        </div>
      )}
    </>
  );
};

export default Chatbot;
