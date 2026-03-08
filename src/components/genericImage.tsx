import {
  Image as ExpoImage,
  ImageProps as ExpoImageProps,
  ImageContentFit,
} from "expo-image";
import { cssInterop } from "nativewind";
import { FC } from "react";
import { setAccessibilityProps } from "../types";

const StyledExpoImage = cssInterop(ExpoImage, {
  className: "style",
}) as React.ComponentType<ExpoImageProps & { className?: string }>;

interface GenericImageProps {
  uri: string;
  accessibilityLabel?: string;
  resizeMode?: ImageContentFit;
  width?: string;
  height?: string;
  className?: string;
  nativeID?: string;
  placeholder?: string;
  cachePolicy?: ExpoImageProps["cachePolicy"];
  priority?: ExpoImageProps["priority"];
  alt?: ExpoImageProps["alt"];
}

const GenericImage: FC<GenericImageProps> = (props) => {
  const {
    uri,
    accessibilityLabel = "image",
    resizeMode = "cover",
    className = "",
    width = "w-full",
    height = "h-full",
    nativeID = "image_component",
    placeholder = null,
    cachePolicy = "disk",
    priority = "normal",
    alt,
  } = props;
  const isRemoteUri = typeof uri === "string" && uri.startsWith("http");
  const source = isRemoteUri ? { uri } : uri;
  return (
    <StyledExpoImage
      source={source}
      contentFit={resizeMode}
      className={`${width} ${height} ${className}`}
      placeholder={placeholder}
      transition={500}
      cachePolicy={cachePolicy}
      priority={priority}
      {...setAccessibilityProps({
        nativeID,
        accessibilityLabel: accessibilityLabel,
      })}
      {...(alt && { alt })}
    />
  );
};

export default GenericImage;
