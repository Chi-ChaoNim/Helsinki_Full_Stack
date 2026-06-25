import { beforeEach, it, expect, vi, describe } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("./services/anecdotes.js", () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    deleteAnecdote: vi.fn(),
  },
}));

import anecdoteService from "./services/anecdotes";
import {
  useAnecdoteStore,
  useAnecdotes,
  useAnecdoteActions,
} from "./anecdoteStore";

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  vi.clearAllMocks();
});

describe("useAnecdoteActions", () => {
  it("initialize loads anecdotes from service", async () => {
    const mockAnecdotes = [
      {
        id: 1,
        content: "Test",
        votes: 0,
      },
    ];

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      await result.current.initialize();
    });

    const { result: anecdoteResult } = renderHook(() => useAnecdotes());
    expect(anecdoteResult.current).toEqual(mockAnecdotes);
  });

  it("the array of anecdotes are sent ordered by votes", async () => {
    const mockAnecdotes = [
      {
        id: 1,
        content: "Test1",
        votes: 2,
      },
      {
        id: 2,
        content: "Test2",
        votes: 12,
      },
      {
        id: 3,
        content: "Test3",
        votes: 5,
      },
    ];

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      await result.current.initialize();
    });

    const { result: anecdoteResult } = renderHook(() => useAnecdotes());

    expect(anecdoteResult.current[0]).toBe(mockAnecdotes[1]);
  });

  it("the array is properly filtered", async () => {
    const mockAnecdotes = [
      {
        id: 1,
        content: "Apple",
        votes: 2,
      },
      {
        id: 2,
        content: "Pear",
        votes: 12,
      },
      {
        id: 3,
        content: "Zebra",
        votes: 5,
      },
    ];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);
    useAnecdoteStore.setState({ filter: "Zebra" });

    const { result } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      await result.current.initialize();
    });

    const { result: anecdoteResult } = renderHook(() => useAnecdotes());

    expect(anecdoteResult.current.length).toEqual(1);
    expect(anecdoteResult.current[0].content).toMatch("Zebra");
  });

  it("voting for anecdote increases vote count", async () => {
    const mockAnecdotes = [
      {
        id: 1,
        content: "Test",
        votes: 1,
      },
    ];

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const updatedAnecdote = {
      ...mockAnecdotes[0],
      votes: mockAnecdotes[0].votes + 1,
    };
    anecdoteService.update.mockResolvedValue(updatedAnecdote);

    const { result } = renderHook(() => useAnecdoteActions());
    await act(async () => {
      await result.current.initialize();
    });

    const { result: anecdoteResult } = renderHook(() => useAnecdotes());
    expect(anecdoteResult.current[0].votes).toBe(1);

    await act(async () => {
      await result.current.vote(mockAnecdotes[0].id);
    });

    expect(anecdoteResult.current[0].votes).toBe(2);
  });
});
