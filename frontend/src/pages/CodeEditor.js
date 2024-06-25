import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { StreamLanguage } from "@codemirror/language";
import { c as cLang } from "@codemirror/legacy-modes/mode/clike";
import axios from "axios";
import "./CodeEditor.css";

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [input, setInput] = useState(""); // State to store user input
  const [output, setOutput] = useState("");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const executeCode = async () => {
    const langMap = {
      javascript: 63,
      python: 71,
      cpp: 54,
      c: 50,
    };

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "false", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "f3ffdc6131msh17d0963cdb37910p14998bjsncd552462d46c",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      data: {
        source_code: code,
        language_id: langMap[language],
        stdin: input, // Include the input
      },
    };

    try {
      const response = await axios.request(options);
      const submissionToken = response.data.token;

      const getResult = async () => {
        const resultOptions = {
          method: "GET",
          url: `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}`,
          params: { base64_encoded: "false", fields: "*" },
          headers: {
            "X-RapidAPI-Key": "f3ffdc6131msh17d0963cdb37910p14998bjsncd552462d46c",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        };

        const resultResponse = await axios.request(resultOptions);
        if (resultResponse.data.status.id <= 2) {
          // If the result is still being processed, poll again after 1 second
          setTimeout(getResult, 1000);
        } else {
          setOutput(resultResponse.data.stdout || resultResponse.data.stderr);
        }
      };

      getResult();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <select onChange={handleLanguageChange} value={language}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
        <button onClick={executeCode}>Run</button>
      </div>
      <CodeMirror
        value={code}
        height="200px"
        extensions={[
          language === "javascript"
            ? javascript()
            : language === "python"
            ? python()
            : language === "cpp"
            ? cpp()
            : StreamLanguage.define(cLang),
        ]}
        onChange={(value) => handleCodeChange(value)}
        basicSetup={basicSetup}
      />
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Enter input here"
        className="input-textarea"
      />
      <div className="output">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
