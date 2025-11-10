import React from "react";
import Button from "./Button";

export default function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="empty_state_card">
      <div className="empty_state_icon">✨</div>
      <h3>{title}</h3>
      {subtitle && <p className="empty_state_subtitle">{subtitle}</p>}
      {actionLabel && (
        <div className="empty_state_action">
          <Button onClick={onAction} variant="outline" className="rounded-full">{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
