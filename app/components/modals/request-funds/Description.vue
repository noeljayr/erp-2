

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

const editor = ref<HTMLDivElement | null>(null);
const toolbar = ref<HTMLDivElement | null>(null);
const showToolbar = ref(false);
const toolbarPosition = ref<{ top: number; left: number }>({ top: 0, left: 0 });
const requestStore = useRequestFormData();
const isEmpty = ref(true);

const placeholderText = "Description (optional)...";

const handleKeyDown = (event: KeyboardEvent) => {
  // Keep default behaviour for typing — overlay is not interactive so caret works normally.
  // We still ignore meta/ctrl/alt combos.
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  // no explicit clearing of innerHTML required — input handler will detect content
};

const handleInput = () => {
  if (!editor.value) return;

  const content = editor.value.innerText.trim();
  const isCurrentlyEmpty = content === "";
  isEmpty.value = isCurrentlyEmpty;

  // Update store with actual content (HTML) when not empty
  if (!isCurrentlyEmpty) {
    requestStore.setDescription(editor.value.innerHTML);
  } else {
    requestStore.setDescription("");
  }
};

const handleFocus = () => {
  // we intentionally DO NOT hide placeholder on focus — it stays until typing,
  // matching your requested behavior.
};

const handleBlur = () => {
  if (!editor.value) return;
  const content = editor.value.innerText.trim();
  isEmpty.value = content === "";
};

const handleSelection = () => {
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    toolbarPosition.value = {
      top: rect.top - 50,
      left: rect.left + rect.width / 2 - 150,
    };

    showToolbar.value = true;
  } else {
    showToolbar.value = false;
  }
};

const formatText = (command: string, value: string | null = null) => {
  document.execCommand(command, false, value ?? undefined);
  editor.value?.focus();
  handleInput(); // Update store after formatting
};

const formatHeading = (headingTag: string) => {
  if (headingTag) {
    formatText('formatBlock', headingTag);
  } else {
    // Reset to paragraph for "Normal" text
    formatText('formatBlock', 'p');
  }
};

const insertLink = () => {
  const url = prompt("Enter URL:");
  if (url) {
    formatText("createLink", url);
  }
};

onMounted(() => {
  document.addEventListener("selectionchange", handleSelection);

  // Start with an empty editor (overlay will show placeholder)
  if (editor.value) {
    editor.value.innerHTML = "";
    isEmpty.value = true;
  }
});

onUnmounted(() => {
  document.removeEventListener("selectionchange", handleSelection);
});
</script>

<template>
  <div class="editor-container mt-1">
    <div
      v-if="showToolbar"
      ref="toolbar"
      class="floating-toolbar"
      :style="{
        top: toolbarPosition.top + 'px',
        left: toolbarPosition.left + 'px',
      }"
    >
      <!-- Heading Levels -->
      <select
        @change="(event) => formatHeading((event.target as HTMLSelectElement).value)"
        class="toolbar-select"
      >
        <option value="">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>

      <!-- Bold -->
      <button
      type="button"
        @click="() => formatText('bold')"
        class="toolbar-btn"
        title="Bold"
      >
        <strong>B</strong>
      </button>

      <!-- Italic -->
      <button
      type="button"
        @click="() => formatText('italic')"
        class="toolbar-btn"
        title="Italic"
      >
        <em>I</em>
      </button>

      <!-- Strikethrough -->
      <button
      type="button"
        @click="() => formatText('strikeThrough')"
        class="toolbar-btn"
        title="Strikethrough"
      >
        <span style="text-decoration: line-through">S</span>
      </button>

      <!-- Link -->
      <button
      type="button" @click="insertLink" class="toolbar-btn" title="Insert Link">
        🔗
      </button>

      <!-- Quote -->
      <button
      type="button"
        @click="() => formatText('formatBlock', 'blockquote')"
        class="toolbar-btn"
        title="Quote"
      >
        ""
      </button>

      <!-- Remove Format -->
      <button
      type="button"
        @click="() => formatText('removeFormat')"
        class="toolbar-btn"
        title="Clear Formatting"
      >
        ✕
      </button>

      <!-- Bullet List -->
      <button
      type="button"
        @click="() => formatText('insertUnorderedList')"
        class="toolbar-btn"
        title="Bullet List"
      >
        ≡
      </button>

      <!-- Code -->
      <button
      type="button"
        @click="() => formatText('formatBlock', 'pre')"
        class="toolbar-btn"
        title="Code Block"
      >
        &lt;/&gt;
      </button>

      <!-- Numbered List -->
      <button
      type="button"
        @click="() => formatText('insertOrderedList')"
        class="toolbar-btn"
        title="Numbered List"
      >
        ☰
      </button>
    </div>

    <div class="editor-wrapper relative w-full h-[12rem]">
      <!-- visually overlaid placeholder (pointer-events: none so user interacts with the editor) -->
      <div v-show="isEmpty" class="placeholder-overlay" aria-hidden="true">
        {{ placeholderText }}
      </div>

      <!-- actual contenteditable -->
      <div
        ref="editor"
        class="rich-editor w-full font-medium h-full relative outline-none"
        contenteditable="true"
        role="textbox"
        aria-multiline="true"
        @keydown="handleKeyDown"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @mouseup="handleSelection"
        @keyup="handleSelection"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.rich-editor:focus {
  border-color: #3b82f6;
}

.rich-editor:focus {
  border-color: #3b82f6;
  outline: none;
}

.editor-wrapper { position: relative; }
.placeholder-overlay {
  position: absolute;
  top: 0;
  left: 0;    /* match editor padding so text aligns */
  pointer-events: none;  /* makes overlay non-interactive */
  user-select: none;     /* can't select the placeholder text */
  color: #9ca3af;
  font-weight: 500;
  width: 100%;
  white-space: pre-wrap;
  overflow: hidden;
}

.floating-toolbar {
  position: fixed;
  z-index: 1000;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 4px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toolbar-btn {
  padding: 6px 8px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
}

.toolbar-btn:active {
  background-color: #e5e7eb;
}

.toolbar-select {
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  cursor: pointer;
  min-width: 60px;
}

.toolbar-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Rich text content styling */
.rich-editor blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

.rich-editor pre {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  overflow-x: auto;
}

.rich-editor ul,
.rich-editor ol {
  padding-left: 2rem;
  margin: 1rem 0;
}

.rich-editor a {
  color: #3b82f6;
  text-decoration: underline;
}

.rich-editor a:hover {
  color: #1d4ed8;
}

/* Heading styles for the rich editor */
.rich-editor h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
  color: #1f2937;
}

.rich-editor h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.875rem 0 0.5rem 0;
  color: #1f2937;
}

.rich-editor h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.75rem 0 0.5rem 0;
  color: #1f2937;
}

.rich-editor h4 {
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0.625rem 0 0.5rem 0;
  color: #1f2937;
}

.rich-editor p {
  margin: 0.5rem 0;
}
</style>
