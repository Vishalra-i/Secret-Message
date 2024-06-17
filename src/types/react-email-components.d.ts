declare module '@react-email/components' {
    import * as React from 'react';
  
    export interface HtmlProps {
      lang?: string;
      dir?: string;
      children?: React.ReactNode;
    }
  
    export interface HeadProps {
      children?: React.ReactNode;
    }
  
    export interface FontProps {
      fontFamily: string;
      fallbackFontFamily?: string;
      webFont?: {
        url: string;
        format: string;
      };
      fontWeight?: number;
      fontStyle?: string;
    }
  
    export interface PreviewProps {
      children?: React.ReactNode;
    }
  
    export interface HeadingProps {
      as: keyof JSX.IntrinsicElements;
      children?: React.ReactNode;
    }
  
    export interface RowProps {
      children?: React.ReactNode;
    }
  
    export interface SectionProps {
      children?: React.ReactNode;
    }
  
    export interface TextProps {
      children?: React.ReactNode;
    }
  
    export interface ButtonProps {
      href: string;
      style?: React.CSSProperties;
      children?: React.ReactNode;
    }
  
    export function Html(props: HtmlProps): JSX.Element;
    export function Head(props: HeadProps): JSX.Element;
    export function Font(props: FontProps): JSX.Element;
    export function Preview(props: PreviewProps): JSX.Element;
    export function Heading(props: HeadingProps): JSX.Element;
    export function Row(props: RowProps): JSX.Element;
    export function Section(props: SectionProps): JSX.Element;
    export function Text(props: TextProps): JSX.Element;
    export function Button(props: ButtonProps): JSX.Element;
  }
  