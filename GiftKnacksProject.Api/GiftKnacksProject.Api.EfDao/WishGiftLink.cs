//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace GiftKnacksProject.Api.EfDao
{
    using System;
    using System.Collections.Generic;
    
    public partial class WishGiftLink
    {
        public int Id { get; set; }
        public long UserId { get; set; }
        public long WishId { get; set; }
        public long GiftId { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
    
        public virtual Gift Gift { get; set; }
        public virtual User User { get; set; }
        public virtual Wish Wish { get; set; }
    }
}