import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookEvent } from "../api/events";

export function useBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}