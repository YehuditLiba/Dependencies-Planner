enum Status {
    PendingResponse = "Pending Response",
    InQueue = "In Q",
    NotInQueue = "Not In Q"
  }
  
  enum TSize {
    Small = "S",
    Medium = "M",
    Large = "L",
    ExtraLarge = "XL"
  }
  
  interface AffectedGroup {
    id: number;
    requestId: number;
    groupId: number;
    status: Status;
    tSize: TSize;
  }
  
  export { Status, TSize, AffectedGroup };
  