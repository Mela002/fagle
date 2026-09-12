import { CircleAlert } from 'lucide-react';

export default function ErrorState({ message = 'Une erreur est survenue.' }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
      <CircleAlert size={16} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
