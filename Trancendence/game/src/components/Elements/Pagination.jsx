import React from "react";
import { FaBackwardFast } from "react-icons/fa6";
import { FaBackwardStep } from "react-icons/fa6";
import { FaForwardStep } from "react-icons/fa6";
import { FaFastForward } from "react-icons/fa";

const Pagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 50,
  loading = false,
  onPageChange,
  className = "",
}) => {
  const p = Number(page) || 1;
  const tp = Math.max(1, Number(totalPages) || 1);
  const canPrev = p > 1;
  const canNext = p < tp;
  const showingFrom = total === 0 ? 0 : (p - 1) * limit + 1;
  const showingTo = Math.min(p * limit, total);

  const go = (n) => {
    if (typeof onPageChange !== "function")
        return;
    const clamped = Math.max(1, Math.min(tp, Number(n)));
    if (clamped === p)
        return;
    onPageChange(clamped);
  };

  return (
    <div className="pagination">
        <button className="paginationBtn"
          disabled={!canPrev || loading}
          onClick={() => go(1)}
        >
        <FaBackwardFast /> First
        </button>
        <button className="paginationBtn"
          disabled={!canPrev || loading}
          onClick={() => go(p - 1)}
        >
          <FaBackwardStep /> Prev
        </button>
        <div >
          Page <b>{p}</b> / <b>{tp}</b>
        </div>
        <button className="paginationBtn"
          disabled={!canNext || loading}
          onClick={() => go(p + 1)}
        >
          Next <FaForwardStep />
        </button>
        <button className="paginationBtn"
          disabled={!canNext || loading}
          onClick={() => go(tp)}
        >
          Last <FaFastForward />
        </button>
        <div >
          Showing <b>{showingFrom}</b>-<b>{showingTo}</b> of <b>{total}</b>
        </div>
    </div>
  );
};

export default Pagination;
