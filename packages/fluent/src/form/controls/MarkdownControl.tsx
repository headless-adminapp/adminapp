import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogTrigger,
  Divider,
  makeStyles,
  type TextareaOnChangeData,
  tokens,
} from '@fluentui/react-components';
import { bundleLazyIcon } from '@headless-adminapp/icons-fluent/lazyIcon';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import CommandBar from '../../CommandBar';
import { Button, DialogSurface, Textarea } from '../../components/fluent';
import { SkeletonControl } from './SkeletonControl';
import type { ControlProps } from './types';

const DEFAULT_MAX_HEIGHT = 300;

export interface MarkdownControlProps extends ControlProps<string> {
  rows?: number;
  maxHeight?: number;
}

const EyeIcon = bundleLazyIcon('Eye24Regular', 'Eye24Filled');
const TextH1Icon = bundleLazyIcon(
  'TextHeader124Regular',
  'TextHeader124Filled',
);
const TextH2Icon = bundleLazyIcon(
  'TextHeader224Regular',
  'TextHeader224Filled',
);
const TextH3Icon = bundleLazyIcon(
  'TextHeader324Regular',
  'TextHeader324Filled',
);
const TextBoldIcon = bundleLazyIcon('TextBold24Regular', 'TextBold24Filled');
const TextItalicIcon = bundleLazyIcon(
  'TextItalic24Regular',
  'TextItalic24Filled',
);
const CodeIcon = bundleLazyIcon('Code24Regular', 'Code24Filled');

// execCommand is deprecated but remains the only cross-browser mechanism that
// pushes textarea edits onto the native undo stack so Cmd+Z works after toolbar actions.
const nativeInsert = (text: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (document as any).execCommand('insertText', false, text);

export function MarkdownControl({
  value,
  onChange,
  id,
  name,
  placeholder,
  onBlur,
  onFocus,
  disabled,
  readOnly,
  rows = 5,
  maxHeight,
  skeleton,
}: Readonly<MarkdownControlProps>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isReadOnly = disabled || readOnly;
  const markdown = value ?? '';
  const [selStart, setSelStart] = useState(0);
  const [selEnd, setSelEnd] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  if (skeleton) {
    return <SkeletonControl height={116} />;
  }

  // Derive active heading from current line
  const lineStart = markdown.lastIndexOf('\n', selStart - 1) + 1;
  const lineContent = markdown.slice(lineStart);
  const activeHeading = lineContent.startsWith('### ')
    ? 'h3'
    : lineContent.startsWith('## ')
      ? 'h2'
      : lineContent.startsWith('# ')
        ? 'h1'
        : null;

  // Derive active inline formats from selection boundaries
  const isWrappedWith = (marker: string) => {
    const n = marker.length;
    if (selStart < n) return false;
    return (
      markdown.slice(selStart - n, selStart) === marker &&
      markdown.slice(selEnd, selEnd + n) === marker
    );
  };
  const isBold = isWrappedWith('**');
  const isItalic = !isBold && isWrappedWith('*');
  const isCode = isWrappedWith('`');

  const updateSel = (el: HTMLTextAreaElement) => {
    setSelStart(el.selectionStart);
    setSelEnd(el.selectionEnd);
  };

  const toggleHeading = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const lStart = markdown.lastIndexOf('\n', start - 1) + 1;
    const line = markdown.slice(lStart);
    const existingMatch = line.match(/^(#{1,3} )/);
    const existingPrefix = existingMatch ? existingMatch[1] : '';
    const newPrefix = existingPrefix === prefix ? '' : prefix;
    const cursorDelta = newPrefix.length - existingPrefix.length;

    el.focus();
    el.setSelectionRange(lStart, lStart + existingPrefix.length);
    nativeInsert(newPrefix);

    requestAnimationFrame(() => {
      const newCursor = Math.max(lStart, start + cursorDelta);
      el.setSelectionRange(newCursor, newCursor);
      setSelStart(newCursor);
      setSelEnd(newCursor);
    });
  };

  const toggleFormat = (marker: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const n = marker.length;
    const alreadyWrapped =
      start >= n &&
      markdown.slice(start - n, start) === marker &&
      markdown.slice(end, end + n) === marker;

    el.focus();

    if (alreadyWrapped) {
      el.setSelectionRange(start - n, end + n);
      nativeInsert(markdown.slice(start, end));
      requestAnimationFrame(() => {
        el.setSelectionRange(start - n, end - n);
        setSelStart(start - n);
        setSelEnd(end - n);
      });
    } else {
      el.setSelectionRange(start, end);
      nativeInsert(marker + markdown.slice(start, end) + marker);
      requestAnimationFrame(() => {
        el.setSelectionRange(start + n, end + n);
        setSelStart(start + n);
        setSelEnd(end + n);
      });
    }
  };

  const handleChange = (
    _: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextareaOnChangeData,
  ) => {
    onChange?.(data.value);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CommandBar.Wrapper>
            <CommandBar.IconButton
              Icon={TextH1Icon}
              disabled={isReadOnly}
              appearance={activeHeading === 'h1' ? 'colored' : 'subtle'}
              onClick={() => toggleHeading('# ')}
            />
            <CommandBar.IconButton
              Icon={TextH2Icon}
              disabled={isReadOnly}
              appearance={activeHeading === 'h2' ? 'colored' : 'subtle'}
              onClick={() => toggleHeading('## ')}
            />
            <CommandBar.IconButton
              Icon={TextH3Icon}
              disabled={isReadOnly}
              appearance={activeHeading === 'h3' ? 'colored' : 'subtle'}
              onClick={() => toggleHeading('### ')}
            />
            <CommandBar.Divider />
            <CommandBar.IconButton
              Icon={TextBoldIcon}
              disabled={isReadOnly}
              appearance={isBold ? 'colored' : 'subtle'}
              onClick={() => toggleFormat('**')}
            />
            <CommandBar.IconButton
              Icon={TextItalicIcon}
              disabled={isReadOnly}
              appearance={isItalic ? 'colored' : 'subtle'}
              onClick={() => toggleFormat('*')}
            />
            <CommandBar.IconButton
              Icon={CodeIcon}
              disabled={isReadOnly}
              appearance={isCode ? 'colored' : 'subtle'}
              onClick={() => toggleFormat('`')}
            />
          </CommandBar.Wrapper>
          <div style={{ flex: 1 }} />

          <div style={{ paddingRight: tokens.spacingHorizontalS }}>
            <Button
              appearance="subtle"
              size="small"
              icon={<EyeIcon />}
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
          </div>

          <Preview
            markdown={markdown}
            visible={showPreview}
            onClose={() => setShowPreview(false)}
          />
        </div>
        <Divider style={{ opacity: 0.5 }} />
      </div>

      <div></div>

      <Textarea
        ref={textareaRef}
        id={id}
        name={name}
        appearance="filled-darker"
        placeholder={placeholder}
        value={markdown}
        onChange={handleChange}
        onBlur={() => onBlur?.()}
        onFocus={() => onFocus?.()}
        readOnly={isReadOnly}
        rows={rows}
        style={{ width: '100%', height: '100%', paddingTop: 40 }}
        textarea={{
          onSelect: (e) => updateSel(e.currentTarget),
          onClick: (e) => updateSel(e.currentTarget),
          onKeyUp: (e) => updateSel(e.currentTarget),
          style: {
            fontFamily: tokens.fontFamilyMonospace,
            fontSize: tokens.fontSizeBase200,
            maxHeight: maxHeight ?? DEFAULT_MAX_HEIGHT,
          },
        }}
      />
    </div>
  );
}

const usePreviewStyles = makeStyles({
  markdown: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    '& h1': {
      fontSize: tokens.fontSizeBase600,
      fontWeight: tokens.fontWeightSemibold,
      margin: `0 0 ${tokens.spacingVerticalM}`,
    },
    '& h2': {
      fontSize: tokens.fontSizeBase500,
      fontWeight: tokens.fontWeightSemibold,
      margin: `0 0 ${tokens.spacingVerticalS}`,
    },
    '& h3': {
      fontSize: tokens.fontSizeBase400,
      fontWeight: tokens.fontWeightSemibold,
      margin: `0 0 ${tokens.spacingVerticalS}`,
    },
    '& p': { margin: `0 0 ${tokens.spacingVerticalS}` },
    '& blockquote': {
      borderLeft: `3px solid ${tokens.colorNeutralStroke1}`,
      margin: `0 0 ${tokens.spacingVerticalS}`,
      paddingLeft: tokens.spacingHorizontalM,
      color: tokens.colorNeutralForeground3,
      fontStyle: 'italic',
    },
    '& code': {
      fontFamily: tokens.fontFamilyMonospace,
      fontSize: tokens.fontSizeBase200,
      backgroundColor: tokens.colorNeutralBackground4,
      padding: `1px ${tokens.spacingHorizontalXS}`,
      borderRadius: tokens.borderRadiusSmall,
    },
    '& pre': {
      backgroundColor: tokens.colorNeutralBackground4,
      padding: tokens.spacingHorizontalM,
      borderRadius: tokens.borderRadiusMedium,
      overflowX: 'auto',
      margin: `0 0 ${tokens.spacingVerticalS}`,
    },
    '& pre code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
    '& ul': {
      paddingLeft: tokens.spacingHorizontalXXL,
      margin: `0 0 ${tokens.spacingVerticalS}`,
    },
    '& ol': {
      paddingLeft: tokens.spacingHorizontalXXL,
      margin: `0 0 ${tokens.spacingVerticalS}`,
    },
    '& a': {
      color: tokens.colorBrandForeground1,
      textDecoration: 'none',
    },
    '& table': {
      borderCollapse: 'collapse',
      width: '100%',
      marginBottom: tokens.spacingVerticalS,
    },
    '& th': {
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
      fontWeight: tokens.fontWeightSemibold,
      backgroundColor: tokens.colorNeutralBackground2,
      textAlign: 'left',
    },
    '& td': {
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    },
  },
});

interface PreviewProps {
  markdown: string;
  visible: boolean;
  onClose: () => void;
}

const Preview: FC<PreviewProps> = ({ markdown, visible, onClose }) => {
  const styles = usePreviewStyles();

  return (
    <Dialog
      open={visible && !!markdown}
      onOpenChange={(_, data) => !data.open && onClose()}
    >
      <DialogSurface style={{ maxWidth: 720 }}>
        <DialogBody>
          <DialogContent>
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary" onClick={onClose}>
                Close
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
