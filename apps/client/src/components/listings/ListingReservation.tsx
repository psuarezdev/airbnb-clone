import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../Button';

interface ListingReservationProps {
  price: number;
  dateRange: Range,
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}

export default function ListingReservation({ price, totalPrice, onChangeDate, dateRange, onSubmit, disabled, disabledDates }: ListingReservationProps) {
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-1 p-4">
        <p className="text-2xl font-semibold">
          € {price}
        </p>
        <p className="font-light text-neutral-600">
          night
        </p>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />
      <div className="p-4">
        <Button
          disabled={disabled}
          label="Reserve"
          onClick={onSubmit}
        />
      </div>
      <hr />
      <div className="flex items-center justify-between p-4 font-semibold text-lg">
        <div>
          Total
        </div>
        <div>
          € {totalPrice}
        </div>
      </div>
    </div>
  );
}
