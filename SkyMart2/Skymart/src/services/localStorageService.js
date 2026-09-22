// LocalStorage Database Service Layer

/**
 * Safely retrieve data from LocalStorage
 */
export const getData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`[localStorageService] Error reading key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Save data to LocalStorage
 */
export const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[localStorageService] Error saving key "${key}":`, error);
    return false;
  }
};

/**
 * Update array element or object in LocalStorage matching a predicate function
 */
export const updateData = (key, predicate, updateFn) => {
  try {
    const existing = getData(key, []);
    if (Array.isArray(existing)) {
      const index = existing.findIndex(predicate);
      if (index !== -1) {
        existing[index] = typeof updateFn === 'function' ? updateFn(existing[index]) : { ...existing[index], ...updateFn };
        saveData(key, existing);
        return existing[index];
      }
    } else if (typeof existing === 'object' && existing !== null) {
      const updated = typeof updateFn === 'function' ? updateFn(existing) : { ...existing, ...updateFn };
      saveData(key, updated);
      return updated;
    }
    return null;
  } catch (error) {
    console.error(`[localStorageService] Error updating key "${key}":`, error);
    return null;
  }
};

/**
 * Delete item from array in LocalStorage matching a predicate
 */
export const deleteData = (key, predicate) => {
  try {
    const existing = getData(key, []);
    if (Array.isArray(existing)) {
      const filtered = existing.filter((item) => !predicate(item));
      saveData(key, filtered);
      return filtered;
    }
    localStorage.removeItem(key);
    return null;
  } catch (error) {
    console.error(`[localStorageService] Error deleting key "${key}":`, error);
    return null;
  }
};

/**
 * Clear a key or all LocalStorage data
 */
export const clearData = (key = null) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
    return true;
  } catch (error) {
    console.error(`[localStorageService] Error clearing key "${key}":`, error);
    return false;
  }
};

// Database Initializer helper
export const initializeDBIfEmpty = (key, defaultData) => {
  const current = getData(key);
  if (current === null || (Array.isArray(current) && current.length === 0)) {
    saveData(key, defaultData);
    return defaultData;
  }
  return current;
};
