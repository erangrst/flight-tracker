import React, { useSyncExternalStore } from 'react';
import { SideBarItem } from '../models/sidebar-item.model';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DefaultInfoComponent } from '../components/default-info.component';

type RegistryListener = () => void;

class SideBarRegistry {
  private items: Map<string, SideBarItem> = new Map();
  private listeners: Set<RegistryListener> = new Set();
  private cachedItems: SideBarItem[] = [];

  /**
   * Programmatically registers a sidebar item with its icon, tooltip, component, and props.
   */
  register<P = Record<string, any>>(item: SideBarItem<P>): void {
    this.items.set(item.id, item as SideBarItem);
    this.cachedItems = Array.from(this.items.values());
    this.notify();
  }

  /**
   * Unregisters a sidebar item by its unique ID.
   */
  unregister(id: string): void {
    if (this.items.delete(id)) {
      this.cachedItems = Array.from(this.items.values());
      this.notify();
    }
  }

  /**
   * Returns all currently registered sidebar items (cached to preserve reference equality).
   */
  getItems(): SideBarItem[] {
    return this.cachedItems;
  }

  /**
   * Returns a specific sidebar item by ID.
   */
  getItem(id: string): SideBarItem | undefined {
    return this.items.get(id);
  }

  /**
   * Subscribes to changes in registered items without synchronous dispatch.
   */
  subscribe(listener: RegistryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const sideBarRegistry = new SideBarRegistry();

/**
 * Global helper to programmatically register a sidebar item.
 * Props are captured and bound at register time.
 */
export function registerSidebarItem<P = Record<string, any>>(item: SideBarItem<P>): void {
  sideBarRegistry.register(item);
}

/**
 * Global helper to unregister a sidebar item by ID.
 */
export function unregisterSidebarItem(id: string): void {
  sideBarRegistry.unregister(id);
}

/**
 * Global helper to get all registered sidebar items.
 */
export function getSidebarItems(): SideBarItem[] {
  return sideBarRegistry.getItems();
}

/**
 * Initializes default sidebar items if none are registered.
 */
export function initSidebar(): void {
  if (sideBarRegistry.getItems().length === 0) {
    registerSidebarItem({
      id: 'information',
      icon: React.createElement(InfoOutlinedIcon),
      tooltip: 'Information',
      title: 'Information-1',
      component: DefaultInfoComponent,
      props: {
        heading: 'Flight Tracker Map 111222',
        description: 'Use the interactive map on the right to track flights, inspect points of interest, and manage bookmarks.',
        showTips: false,
      },
    });
  }
}

// Auto-initialize default items
initSidebar();

/**
 * React hook to observe registered sidebar items using useSyncExternalStore.
 * Avoids calling setState synchronously in an effect and prevents cascading re-renders.
 */
export function useSidebarItems(): SideBarItem[] {
  return useSyncExternalStore(
    (callback) => sideBarRegistry.subscribe(callback),
    () => sideBarRegistry.getItems(),
    () => sideBarRegistry.getItems(),
  );
}
