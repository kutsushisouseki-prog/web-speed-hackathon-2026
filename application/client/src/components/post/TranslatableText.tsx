import { useCallback, useState } from "react";

import { createTranslator } from "@web-speed-hackathon-2026/client/src/utils/create_translator";

type State =
  | { type: "idle"; text: string }
  | { type: "loading" }
  | { type: "translated"; text: string; original: string };

interface Props {
  text: string;
}

export const TranslatableText = ({ text }: Props) => {
  const [state, updateState] = useState<State>({ type: "idle", text });

  const handleClick = useCallback(() => {
    switch (state.type) {
      case "idle": {
        (async () => {
          updateState({ type: "loading" });
          try {
            using translator = await createTranslator({
              sourceLanguage: "ja",
              targetLanguage: "en",
            });
            const result = await translator.translate(state.text);

            updateState({
              type: "translated",
              text: result,
              original: state.text,
            });
          } catch {
            updateState({
              type: "translated",
              text: "翻訳に失敗しました",
              original: state.text,
            });
          }
        })();
        break;
      }
      case "translated": {
        updateState({ type: "idle", text: state.original });
        break;
      }
      default: {
        state.type satisfies "loading";
        break;
      }
    }
  }, [state]);

  return (
    <>
      <p>
        {state.type !== "loading" ? (
          <span>{state.text}</span>
        ) : (
          <span className="bg-cax-surface-subtle text-cax-text-muted">{text}</span>
        )}
      </p>

      <p>
        <button
          className="text-cax-accent disabled:text-cax-text-subtle hover:underline disabled:cursor-default"
          type="button"
          disabled={state.type === "loading"}
          onClick={handleClick}
        >
          {state.type === "idle" ? <span>Show Translation</span> : null}
          {state.type === "loading" ? <span>Translating...</span> : null}
          {state.type === "translated" ? <span>Show Original</span> : null}
        </button>
      </p>
    </>
  );
};
import { useCallback, useState, useEffect } from "react";
import { createTranslator } from "@web-speed-hackathon-2026/client/src/utils/create_translator";

type State =
  | { type: "idle"; text: string }
  | { type: "loading" }
  | { type: "translated"; text: string; original: string };

interface Props {
  text: string;
}

export const TranslatableText = ({ text }: Props) => {
  const [state, updateState] = useState<State>({ type: "idle", text });

  // Propsのtextが変わったらリセットする
  useEffect(() => {
    updateState({ type: "idle", text });
  }, [text]);

  const handleClick = useCallback(() => {
    // 関数型アップデートを使い、依存配列から state を外す
    updateState((prevState) => {
      if (prevState.type === "translated") {
        return { type: "idle", text: prevState.original };
      }

      if (prevState.type === "idle") {
        // 非同期処理を開始
        (async () => {
          try {
            // ここで prevState.text を直接使うとクロージャの問題が出るため、
            // 翻訳開始時の text をキャプチャしておく
            const sourceText = prevState.text;
            
            using translator = await createTranslator({
              sourceLanguage: "ja",
              targetLanguage: "en",
            });
            const result = await translator.translate(sourceText);

            updateState({
              type: "translated",
              text: result,
              original: sourceText,
            });
          } catch {
            updateState({
              type: "translated",
              text: "翻訳に失敗しました",
              original: prevState.text,
            });
          }
        })();
        return { type: "loading" };
      }

      return prevState;
    });
  }, []); // 依存配列が空になり、関数が安定する

  return (
    <>
      <p>
        {state.type !== "loading" ? (
          <span>{state.text}</span>
        ) : (
          <span className="bg-cax-surface-subtle text-cax-text-muted">{text}</span>
        )}
      </p>

      <p>
        <button
          className="text-cax-accent disabled:text-cax-text-subtle hover:underline disabled:cursor-default"
          type="button"
          disabled={state.type === "loading"}
          onClick={handleClick}
        >
          {state.type === "idle" && "Show Translation"}
          {state.type === "loading" && "Translating..."}
          {state.type === "translated" && "Show Original"}
        </button>
      </p>
    </>
  );
};
