import React, { useState, useCallback, useEffect } from 'react';
import { CreatePromptDto } from '../../models/Prompt';
import Button from '../common/Button';
import { validatePrompt } from '../../utils/Validators';

// ✨ 1. Abstracted FormField sub-component to reduce repetition
interface FormFieldProps {
  id: string;
  name: keyof CreatePromptDto;
  label: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  as?: 'input' | 'textarea';
  rows?: number;
  placeholder?: string;
  fontClass?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id, name, label, value, error, onChange, as = 'input', rows, placeholder, fontClass = ''
}) => {
  const commonClasses = `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${fontClass}`;
  const errorClasses = 'border-red-500';
  const finalClassName = `${commonClasses} ${error ? errorClasses : 'border'}`;
  
  const InputComponent = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <InputComponent
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={finalClassName}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Main Component
interface PromptFormProps {
  initialData?: CreatePromptDto;
  onSubmit: (data: CreatePromptDto) => Promise<void>;
  isLoading?: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({
  initialData = { title: '', content: '', description: '', tags: [] },
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreatePromptDto>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  // ✨ 3. Sync state if initialData prop changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // ✨ 2. Memoize handlers with useCallback for performance
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  }, []);

  const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePrompt(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        id="title"
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />
      <FormField
        id="description"
        name="description"
        label="Description"
        as="textarea"
        rows={3}
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />
      <FormField
        id="content"
        name="content"
        label="Prompt Content"
        as="textarea"
        rows={8}
        fontClass="font-mono"
        value={formData.content}
        onChange={handleChange}
        error={errors.content}
      />

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-1 flex">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
            placeholder="Add a tag and press Enter"
          />
          <Button type="button" onClick={handleAddTag} className="rounded-l-none">Add</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <span key={tag} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {tag}
              <button
                type="button"
                // ✨ 4. Added aria-label for accessibility
                aria-label={`Remove tag ${tag}`}
                onClick={() => handleRemoveTag(tag)}
                className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Submit Prompt
        </Button>
      </div>
    </form>
  );
};

export default PromptForm;