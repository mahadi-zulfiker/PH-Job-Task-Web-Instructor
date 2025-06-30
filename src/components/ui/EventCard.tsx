// src/components/EventCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { EventData } from '@/lib/types';

interface EventCardProps {
  event: EventData;
  onJoin?: (eventId: string) => void;
  onUpdate?: (event: EventData) => void;
  onDelete?: (eventId: string) => void;
  showActions?: boolean;
  currentUserId?: string;
}

const EventCard = ({ event, onJoin, onUpdate, onDelete, showActions, currentUserId }: EventCardProps) => {
  const formattedDate = format(new Date(event.date), 'PPP');
  const hasJoined = event.attendees?.includes(currentUserId || '');
  const isPoster = currentUserId === event.postedBy;

  return (
    <Card className="flex flex-col justify-between transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-primary/20 hover:border-primary"> {/* Added animations */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">{event.title}</CardTitle> {/* Made title more prominent */}
        <p className="text-sm text-muted-foreground">Posted by: <span className="font-medium">{event.postedByName}</span></p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm"> {/* Smaller text for content */}
        <p><strong className="text-foreground">Date:</strong> {formattedDate}</p>
        <p><strong className="text-foreground">Time:</strong> {event.time}</p>
        <p><strong className="text-foreground">Location:</strong> {event.location}</p>
        <p className="text-muted-foreground line-clamp-3"><strong>Description:</strong> {event.description}</p> {/* Clamp description */}
        <p><strong>Attendees:</strong> <span className="font-semibold text-primary">{event.attendeeCount}</span></p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {onJoin && (
          <Button
            onClick={() => onJoin(event._id)}
            disabled={hasJoined}
            className="transition-transform hover:scale-105" // Button animation
          >
            {hasJoined ? 'Joined' : 'Join Event'}
          </Button>
        )}
        {showActions && isPoster && (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onUpdate && onUpdate(event)} className="transition-transform hover:scale-105">Update</Button>
            <Button variant="destructive" onClick={() => onDelete && onDelete(event._id)} className="transition-transform hover:scale-105">Delete</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;