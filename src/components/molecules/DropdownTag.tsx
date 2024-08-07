import React, {
  HTMLAttributes,
  useState,
  useEffect,
  useRef,
} from 'react';
import { DropdownItem } from '../atoms/Dropdown';
import Tag from '../atoms/Tag';
import { useActionOnClickOutside } from '../../common/custom-hooks';

export interface DropdownTagProps<T extends string> extends HTMLAttributes<HTMLDivElement> {
  values: DropdownItem<T>[];
  onChangeHandler: (value: T[]) => void;
  currentValues: T[];
  defaultLabel?: string;
  disabled?: boolean;
}

export default function DropdownTag<T extends string>({
  values,
  currentValues,
  onChangeHandler,
  defaultLabel,
  disabled = false,
  className,
  ...nativeProps
}: DropdownTagProps<T>) {
  const DEFAULT_DROPDOWN_LABEL = 'Pilih...';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableDropdownItems, setAvailableDropdownItems] = useState<DropdownItem<T>[]>([]);
  const [selectedDropdownItems, setSelectedDropdownItems] = useState<DropdownItem<T>[]>([]);

  const getClassName = () => {
    const dropdownTagClose = isDropdownOpen ? '' : 'kc-dropdown-tag--close';
    const dropdownTagDisabled = disabled ? 'kc-dropdown-tag--disabled' : '';
    const dropdownTagVariant = [dropdownTagClose, dropdownTagDisabled].join(' ');
    const result = className ? `kc-dropdown-tag ${dropdownTagVariant} ${className}` : `kc-dropdown-tag ${dropdownTagVariant}`;
    return result.replace(/\s{2,}/, ' ').trim();
  };

  const dropdownRef = useRef(null);
  useActionOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    const targetSelectedDropdownItems = values
      .filter(({ value }) => currentValues.includes(value));
    const targetAvailableDropdownItems = values
      .filter(({ value }) => !currentValues.includes(value));

    setSelectedDropdownItems(targetSelectedDropdownItems);
    setAvailableDropdownItems(targetAvailableDropdownItems);
  }, [values, currentValues, defaultLabel]);

  const onDropdownItemClick = (dropdownItem: DropdownItem<T>) => {
    const selectedDropdownItemsAfter = selectedDropdownItems.concat(dropdownItem);
    const selectedValues = selectedDropdownItemsAfter
      .map((selectedDropdownItem) => selectedDropdownItem.value);

    onChangeHandler(selectedValues);
    setIsDropdownOpen(false);
    setAvailableDropdownItems(availableDropdownItems.filter(({ id }) => id !== dropdownItem.id));
    setSelectedDropdownItems(selectedDropdownItems.concat(dropdownItem));
  };

  const onDropdownItemRemove = (id: string) => {
    const selectedDropdownItemsUpdated = selectedDropdownItems
      .filter((selectedDropdownItem) => selectedDropdownItem.id !== id);
    const availableDropdownItemsUpdated = availableDropdownItems
      .concat(values.filter((value) => value.id === id));

    onChangeHandler(selectedDropdownItemsUpdated.map(({ value }) => value));
    setSelectedDropdownItems(selectedDropdownItemsUpdated);
    setAvailableDropdownItems(availableDropdownItemsUpdated);
    setIsDropdownOpen(false);
  };

  const onToggleDropdown = () => {
    if (disabled) return;
    const height = (document.querySelector('.kc-dropdown-tag') as HTMLElement).clientHeight;
    const dropdownItems = document.querySelector('.kc-dropdown__items') as HTMLElement;
    dropdownItems.style.top = `${height}px`;
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderDropdownButtonIcon = () => (
    isDropdownOpen
      ? <i className="fas fa-angle-up" />
      : <i className="fas fa-angle-down" />
  );

  const renderDropdownButtonContent = () => (
    <div className="kc-dropdown-button__content" style={{ paddingBottom: selectedDropdownItems.length === 0 ? 0 : 5 }}>
      {selectedDropdownItems.length > 0 ? (
        selectedDropdownItems.map(({ id, label }) => (
          <Tag
            key={id}
            label={label}
            disabled={disabled}
            onRemove={() => onDropdownItemRemove(id)}
          />
        ))
      ) : (
        <span className="kc-button-label">
          {defaultLabel || DEFAULT_DROPDOWN_LABEL}
        </span>
      )}
      <div className="kc-dropdown-button__icon">
        {renderDropdownButtonIcon()}
      </div>
    </div>
  );

  return (
    <div ref={dropdownRef} className={getClassName()} {...nativeProps}>
      <div
        className="kc-dropdown-button kc-button-label"
        role="button"
        aria-label="Dropdown Tag"
        aria-pressed={false}
        tabIndex={0}
        onClick={onToggleDropdown}
        onKeyDown={onToggleDropdown}
      >
        {renderDropdownButtonContent()}
      </div>
      {availableDropdownItems.length > 0 ? (
        <ul className="kc-dropdown__items">
          {availableDropdownItems.map((availableDropdownItem) => (
            <li className="kc-dropdown__item" key={availableDropdownItem.id}>
              <button type="button" onClick={() => onDropdownItemClick(availableDropdownItem)}>
                <span className="kc-body2">{availableDropdownItem.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="kc-dropdown__items">
          <li className="kc-dropdown__item--empty">
            <span className="kc-body2">Tidak ada pilihan tersedia</span>
          </li>
        </ul>
      )}
    </div>
  );
}
