﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos.Comments;
using GiftKnacksProject.Api.Dto.Dtos.Profile;
using GiftKnacksProject.Api.EfDao.Base;

namespace GiftKnacksProject.Api.EfDao.Repositories
{
    public class CommentRepository:GenericRepository<Comment>, ICommentRepository
    {
        public CommentRepository(EfContext context)
            :base(context)
        {
            
        }

        public  Task<CommentDto> AddCommentToWish(long wishId,long commentUserId,string text, long? parentId = null)
        {
            var newComment = InsertComment(commentUserId, text, parentId);
            InsertWishLink(wishId, newComment);
            return Task.FromResult(ConvertCommentToDto(newComment));

        }

        public  Task<CommentDto> AddCommentToGift(long giftId, long commentUserId, string text, long? parentId = null)
        {
            var newComment = InsertComment(commentUserId,text,parentId);
            InsertGiftLink(giftId, newComment);
            return Task.FromResult(ConvertCommentToDto(newComment));
        }

        public async Task<List<CommentDto>> GetCommentListByWishId(GetCommentsDto getCommentsDto)
        {
            var query = Db.Set<WishLinkComment>().Where(x => x.WishId == getCommentsDto.Id).Where(y => y.Comment.ParentCommentId == null);
            query = query.OrderByDescending(x=>x.Comment.UpdateTime).Skip(getCommentsDto.Offset).Take(getCommentsDto.Length);
            var collection = await query.ToListAsync();

            return ConvertToCommentDto(collection);
        }

        private static List<CommentDto> ConvertToCommentDto(List<WishLinkComment> collection)
        {
            return collection.
                Select(y => new CommentDto()
                {
                    Id = y.Comment.Id,
                    Text = y.Comment.Text,
                    UpdateTime = y.Comment.UpdateTime,
                    User = new TinyProfileDto()
                    {
                        Id = y.Comment.User.Id,
                        AvatarUrl = y.Comment.User.Profile.AvatarUrl,
                        FirstName = y.Comment.User.Profile.FirstName,
                        LastName = y.Comment.User.Profile.LastName
                    },
                    ChildComments = y.Comment.Comments1.Select(z => new CommentDto()
                    {
                        Id = z.Id,
                        Text = z.Text,
                        UpdateTime = z.UpdateTime,
                        User = new TinyProfileDto()
                        {
                            Id = y.Comment.User.Id,
                            AvatarUrl = y.Comment.User.Profile.AvatarUrl,
                            FirstName = y.Comment.User.Profile.FirstName,
                            LastName = y.Comment.User.Profile.LastName
                        }
                    }).ToList()
                }).ToList();
        }

        private static List<CommentDto> ConvertToCommentDto(List<GiftLinkComment> collection)
        {
            return collection.
                Select(y => new CommentDto()
                {
                    Id = y.Comment.Id,
                    Text = y.Comment.Text,
                    UpdateTime = y.Comment.UpdateTime,
                    User = new TinyProfileDto()
                    {
                        Id = y.Comment.User.Id,
                        AvatarUrl = y.Comment.User.Profile.AvatarUrl,
                        FirstName = y.Comment.User.Profile.FirstName,
                        LastName = y.Comment.User.Profile.LastName
                    },
                    ChildComments = y.Comment.Comments1.Select(z => new CommentDto()
                    {
                        Id = z.Id,
                        Text = z.Text,
                        UpdateTime = z.UpdateTime,
                        User = new TinyProfileDto()
                        {
                            Id = y.Comment.User.Id,
                            AvatarUrl = y.Comment.User.Profile.AvatarUrl,
                            FirstName = y.Comment.User.Profile.FirstName,
                            LastName = y.Comment.User.Profile.LastName
                        }
                    }).ToList()
                }).ToList();
        }

        public async Task<List<CommentDto>> GetCommentListByGiftId(GetCommentsDto getCommentsDto)
        {
            var query = Db.Set<GiftLinkComment>().Where(x => x.GiftId == getCommentsDto.Id).Where(y => y.Comment.ParentCommentId == null);
            query = query.OrderByDescending(x => x.Comment.UpdateTime).Skip(getCommentsDto.Offset).Take(getCommentsDto.Length);
            var collection = await query.ToListAsync();
            return ConvertToCommentDto(collection);
        }

        private  CommentDto ConvertCommentToDto(Comment newComment)
        {
            return new CommentDto()
            {
                Id = newComment.Id,
                Text = newComment.Text,
                UpdateTime = newComment.UpdateTime,
                User = new TinyProfileDto()
                {
                    Id = newComment.User.Id,
                    AvatarUrl = newComment.User.Profile.AvatarUrl,
                    FirstName = newComment.User.Profile.FirstName,
                    LastName = newComment.User.Profile.LastName
                }
            };
        }

        private Comment InsertComment(long commentUserId, string text,long? parentId)
        {
            var newComment = new Comment();
            newComment.User = Db.Set<User>().Find(commentUserId);
            newComment.Text = text;
            newComment.ParentCommentId = parentId;
            newComment.UpdateTime=DateTime.Now;
            base.Insert(newComment);
            base.Save();
            return newComment;
        }

        private void InsertWishLink(long wishId, Comment newComment)
        {
            var link = new WishLinkComment();
            link.Comment = newComment;
            link.WishId = wishId;
            Db.Set<WishLinkComment>().Add(link);
            base.Save();
        }

        private void InsertGiftLink(long giftId, Comment newComment)
        {
            var link = new GiftLinkComment();
            link.Comment = newComment;
            link.GiftId = giftId;
            Db.Set<GiftLinkComment>().Add(link);
            base.Save();
        }
    }
}