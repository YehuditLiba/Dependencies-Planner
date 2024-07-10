"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSize = exports.Status = void 0;
var Status;
(function (Status) {
    Status["PendingResponse"] = "Pending Response";
    Status["InQueue"] = "In Q";
    Status["NotInQueue"] = "Not In Q";
})(Status || (exports.Status = Status = {}));
var TSize;
(function (TSize) {
    TSize["Small"] = "S";
    TSize["Medium"] = "M";
    TSize["Large"] = "L";
    TSize["ExtraLarge"] = "XL";
})(TSize || (exports.TSize = TSize = {}));
