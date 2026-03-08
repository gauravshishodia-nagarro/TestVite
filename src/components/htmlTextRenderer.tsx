import React from "react";
import constants from "../configs/constants";
import { setAccessibilityProps } from "../types";
import CustomText from "./customText";

type HtmlTextRendererProps = {
  html: string;
  parentClassName?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  boldClassName?: string;
};

const TAG_CLASSNAMES: Record<string, string> = {
  strong: "font-primary-bold",
  b: "font-primary-bold",
  i: "italic",
  em: "italic",
  u: "underline",
};

const parseHtmlToText = (
  html: string,
  boldClassName: string
): React.ReactNode[] => {
  const tagRegex = /<(strong|b|i|em|u)>(.*?)<\/\1>/i;
  const result: React.ReactNode[] = [];

  let remaining = html;
  let match: RegExpExecArray | null = tagRegex.exec(remaining);
  let keyIndex = 0;

  while (match !== null) {
    const [fullMatch, tag, innerText] = match;
    const index = match.index;

    // Push plain text before the tag
    if (index > 0) {
      result.push(
        <CustomText key={`plain-${keyIndex++}`} className="">
          {remaining.slice(0, index)}
        </CustomText>
      );
    }

    try {
      result.push(
        <CustomText
          key={`tag-${keyIndex++}`}
          className={`${TAG_CLASSNAMES[tag.toLowerCase()]} ${
            ["strong", "b"].includes(tag.toLowerCase()) ? boldClassName : ""
          }`}
        >
          {parseHtmlToText(innerText, boldClassName)}
        </CustomText>
      );
    } catch (err) {
      console.warn("Error parsing tag:", tag, err);
      result.push(
        <CustomText key={`fallback-${keyIndex++}`} className="">
          {innerText}
        </CustomText>
      );
    }

    remaining = remaining.slice(index + fullMatch.length);
    match = tagRegex.exec(remaining);
  }

  if (remaining) {
    result.push(
      <CustomText key={`remain-${keyIndex++}`} className="">
        {remaining}
      </CustomText>
    );
  }

  return result;
};

const HtmlTextRenderer: React.FC<HtmlTextRendererProps> = ({
  html,
  parentClassName = "font-primary-regular",
  nativeID = "html_text_renderer",
  accessibilityLabel,
  boldClassName = "",
}) => {
  try {
    return (
      <CustomText
        className={parentClassName}
        {...setAccessibilityProps({
          nativeID,
          accessibilityLabel,
          role: "text",
        })}
      >
        {parseHtmlToText(html, boldClassName)}
      </CustomText>
    );
  } catch (error) {
    console.warn("HtmlTextRenderer parsing error:", error);
    return <CustomText className={parentClassName}>{html}</CustomText>; // fallback to plain html
  }
};

export default HtmlTextRenderer;
