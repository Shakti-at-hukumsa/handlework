import { useEffect, useCallback } from 'react';

/**
 * Custom hook for managing keyboard shortcuts
 * 
 * @param {Object} shortcuts - Object mapping key combinations to callback functions
 * @param {boolean} enabled - Whether shortcuts are enabled
 * @param {Element|null} targetElement - Element to attach listeners to (defaults to document)
 * @returns {Object} - Methods to enable/disable shortcuts
 * 
 * Example usage:
 * const shortcuts = {
 *   'ctrl+s': (e) => { e.preventDefault(); saveData(); },
 *   'esc': () => closeModal(),
 *   'shift+a': selectAllItems
 * };
 * 
 * const { enableShortcuts, disableShortcuts } = useKeyboardShortcuts(shortcuts);
 */
const useKeyboardShortcuts = (shortcuts = {}, enabled = true, targetElement = null) => {
  // Format shortcut key for display
  const formatShortcutForDisplay = (shortcut) => {
    return shortcut
      .split('+')
      .map(key => {
        if (key === 'ctrl') return '⌃';
        if (key === 'alt') return '⌥';
        if (key === 'shift') return '⇧';
        if (key === 'meta') return '⌘';
        if (key === 'esc') return 'Esc';
        if (key === 'enter') return '↵';
        if (key === 'tab') return '⇥';
        if (key === 'space') return 'Space';
        if (key === 'arrowup') return '↑';
        if (key === 'arrowdown') return '↓';
        if (key === 'arrowleft') return '←';
        if (key === 'arrowright') return '→';
        return key.toUpperCase();
      })
      .join(' + ');
  };
  
  // Get a map of formatted shortcut displays
  const getShortcutDisplayMap = useCallback(() => {
    const displayMap = {};
    
    for (const shortcut in shortcuts) {
      displayMap[shortcut] = formatShortcutForDisplay(shortcut);
    }
    
    return displayMap;
  }, [shortcuts]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    // Don't process shortcuts if typing in input, textarea, or select
    if (
      event.target.tagName === 'INPUT' || 
      event.target.tagName === 'TEXTAREA' || 
      event.target.tagName === 'SELECT' ||
      event.target.isContentEditable
    ) {
      return;
    }
    
    // Build a string representation of the key combination
    let keyCombo = '';
    if (event.ctrlKey) keyCombo += 'ctrl+';
    if (event.altKey) keyCombo += 'alt+';
    if (event.shiftKey) keyCombo += 'shift+';
    if (event.metaKey) keyCombo += 'meta+'; // Command key on Mac
    
    // Get the main key and convert to lowercase
    const key = event.key.toLowerCase();
    
    // Handle special key names
    let normalizedKey = key;
    if (key === ' ') normalizedKey = 'space';
    if (key === 'escape') normalizedKey = 'esc';
    if (key === 'arrowup') normalizedKey = 'up';
    if (key === 'arrowdown') normalizedKey = 'down';
    if (key === 'arrowleft') normalizedKey = 'left';
    if (key === 'arrowright') normalizedKey = 'right';
    if (key === 'delete' || key === 'del') normalizedKey = 'delete';
    
    keyCombo += normalizedKey;
    
    // Execute the callback if a matching shortcut is found
    if (shortcuts[keyCombo]) {
      shortcuts[keyCombo](event);
    }
  }, [shortcuts]);
  
  // Enable shortcuts
  const enableShortcuts = useCallback(() => {
    const element = targetElement || document;
    element.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, targetElement]);
  
  // Disable shortcuts
  const disableShortcuts = useCallback(() => {
    const element = targetElement || document;
    element.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, targetElement]);
  
  useEffect(() => {
    // Set up event listeners when the component mounts
    if (enabled) {
      enableShortcuts();
    }
    
    // Clean up when the component unmounts
    return disableShortcuts;
  }, [enabled, enableShortcuts, disableShortcuts]);
  
  return {
    enableShortcuts,
    disableShortcuts,
    shortcutDisplayMap: getShortcutDisplayMap(),
    formatShortcutForDisplay
  };
};

export default useKeyboardShortcuts; 