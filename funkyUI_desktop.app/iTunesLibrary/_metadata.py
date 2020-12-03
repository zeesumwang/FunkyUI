# This file is generated by objective.metadata
#
# Last update: Mon Mar 16 13:57:50 2020
#
# flake8: noqa

import objc, sys

if sys.maxsize > 2 ** 32:

    def sel32or64(a, b):
        return b


else:

    def sel32or64(a, b):
        return a


misc = {}
constants = """$ITLibMediaEntityPropertyPersistentID$ITLibMediaItemPropertyAddedDate$ITLibMediaItemPropertyAlbumArtist$ITLibMediaItemPropertyAlbumDiscCount$ITLibMediaItemPropertyAlbumDiscNumber$ITLibMediaItemPropertyAlbumIsCompilation$ITLibMediaItemPropertyAlbumIsGapless$ITLibMediaItemPropertyAlbumRating$ITLibMediaItemPropertyAlbumRatingComputed$ITLibMediaItemPropertyAlbumTitle$ITLibMediaItemPropertyAlbumTrackCount$ITLibMediaItemPropertyArtistName$ITLibMediaItemPropertyArtwork$ITLibMediaItemPropertyBeatsPerMinute$ITLibMediaItemPropertyBitRate$ITLibMediaItemPropertyCategory$ITLibMediaItemPropertyComments$ITLibMediaItemPropertyComposer$ITLibMediaItemPropertyContentRating$ITLibMediaItemPropertyDescription$ITLibMediaItemPropertyFileSize$ITLibMediaItemPropertyFileType$ITLibMediaItemPropertyGenre$ITLibMediaItemPropertyGrouping$ITLibMediaItemPropertyHasArtwork$ITLibMediaItemPropertyIsDRMProtected$ITLibMediaItemPropertyIsPurchased$ITLibMediaItemPropertyIsUserDisabled$ITLibMediaItemPropertyIsVideo$ITLibMediaItemPropertyKind$ITLibMediaItemPropertyLastPlayDate$ITLibMediaItemPropertyLocation$ITLibMediaItemPropertyLocationType$ITLibMediaItemPropertyLyricsContentRating$ITLibMediaItemPropertyMediaKind$ITLibMediaItemPropertyModifiedDate$ITLibMediaItemPropertyMovementCount$ITLibMediaItemPropertyMovementName$ITLibMediaItemPropertyMovementNumber$ITLibMediaItemPropertyPlayCount$ITLibMediaItemPropertyPlayStatus$ITLibMediaItemPropertyRating$ITLibMediaItemPropertyRatingComputed$ITLibMediaItemPropertyReleaseDate$ITLibMediaItemPropertySampleRate$ITLibMediaItemPropertySize$ITLibMediaItemPropertySkipDate$ITLibMediaItemPropertySortAlbumArtist$ITLibMediaItemPropertySortAlbumTitle$ITLibMediaItemPropertySortArtistName$ITLibMediaItemPropertySortComposer$ITLibMediaItemPropertySortTitle$ITLibMediaItemPropertyStartTime$ITLibMediaItemPropertyStopTime$ITLibMediaItemPropertyTitle$ITLibMediaItemPropertyTotalTime$ITLibMediaItemPropertyTrackNumber$ITLibMediaItemPropertyUserSkipCount$ITLibMediaItemPropertyVideoEpisode$ITLibMediaItemPropertyVideoEpisodeOrder$ITLibMediaItemPropertyVideoHeight$ITLibMediaItemPropertyVideoIsHD$ITLibMediaItemPropertyVideoSeason$ITLibMediaItemPropertyVideoSeries$ITLibMediaItemPropertyVideoSortSeries$ITLibMediaItemPropertyVideoWidth$ITLibMediaItemPropertyVoiceOverLanguage$ITLibMediaItemPropertyVolumeAdjustment$ITLibMediaItemPropertyVolumeNormalizationEnergy$ITLibMediaItemPropertyWork$ITLibMediaItemPropertyYear$ITLibPlaylistPropertyAllItemsPlaylist$ITLibPlaylistPropertyDistinguisedKind$ITLibPlaylistPropertyItems$ITLibPlaylistPropertyKind$ITLibPlaylistPropertyMaster$ITLibPlaylistPropertyName$ITLibPlaylistPropertyParentPersistentID$ITLibPlaylistPropertyVisible$"""
enums = """$ITLibArtworkFormatBMP@6$ITLibArtworkFormatBitmap@1$ITLibArtworkFormatGIF@4$ITLibArtworkFormatJPEG@2$ITLibArtworkFormatJPEG2000@3$ITLibArtworkFormatNone@0$ITLibArtworkFormatPICT@8$ITLibArtworkFormatPNG@5$ITLibArtworkFormatTIFF@7$ITLibDistinguishedPlaylistKind90sMusic@42$ITLibDistinguishedPlaylistKindApplications@51$ITLibDistinguishedPlaylistKindBooks@4$ITLibDistinguishedPlaylistKindClassicalMusic@48$ITLibDistinguishedPlaylistKindHomeVideos@50$ITLibDistinguishedPlaylistKindLibraryMusicVideos@49$ITLibDistinguishedPlaylistKindLovedSongs@52$ITLibDistinguishedPlaylistKindMovies@1$ITLibDistinguishedPlaylistKindMusic@3$ITLibDistinguishedPlaylistKindMusicShowsAndMovies@53$ITLibDistinguishedPlaylistKindMusicVideos@47$ITLibDistinguishedPlaylistKindMyTopRated@43$ITLibDistinguishedPlaylistKindNone@0$ITLibDistinguishedPlaylistKindPodcasts@7$ITLibDistinguishedPlaylistKindPurchases@16$ITLibDistinguishedPlaylistKindRecentlyAdded@46$ITLibDistinguishedPlaylistKindRecentlyPlayed@45$ITLibDistinguishedPlaylistKindRingtones@5$ITLibDistinguishedPlaylistKindTVShows@2$ITLibDistinguishedPlaylistKindTop25MostPlayed@44$ITLibDistinguishedPlaylistKindVoiceMemos@14$ITLibDistinguishedPlaylistKindiTunesU@26$ITLibExportFeatureNone@0$ITLibInitOptionLazyLoadData@1$ITLibInitOptionNone@0$ITLibMediaItemLocationTypeFile@1$ITLibMediaItemLocationTypeRemote@3$ITLibMediaItemLocationTypeURL@2$ITLibMediaItemLocationTypeUnknown@0$ITLibMediaItemLyricsContentRatingClean@2$ITLibMediaItemLyricsContentRatingExplicit@1$ITLibMediaItemLyricsContentRatingNone@0$ITLibMediaItemMediaKindAlertTone@21$ITLibMediaItemMediaKindAudiobook@5$ITLibMediaItemMediaKindBook@19$ITLibMediaItemMediaKindDigitalBooklet@15$ITLibMediaItemMediaKindHomeVideo@12$ITLibMediaItemMediaKindIOSApplication@16$ITLibMediaItemMediaKindInteractiveBooklet@9$ITLibMediaItemMediaKindMovie@3$ITLibMediaItemMediaKindMusicVideo@7$ITLibMediaItemMediaKindPDFBook@20$ITLibMediaItemMediaKindPDFBooklet@6$ITLibMediaItemMediaKindPodcast@4$ITLibMediaItemMediaKindRingtone@14$ITLibMediaItemMediaKindSong@2$ITLibMediaItemMediaKindTVShow@8$ITLibMediaItemMediaKindUnknown@1$ITLibMediaItemMediaKindVoiceMemo@17$ITLibMediaItemMediaKindiTunesU@18$ITLibMediaItemPlayStatusNone@0$ITLibMediaItemPlayStatusPartiallyPlayed@1$ITLibMediaItemPlayStatusUnplayed@2$ITLibPlaylistKindFolder@3$ITLibPlaylistKindGenius@2$ITLibPlaylistKindGeniusMix@4$ITLibPlaylistKindRegular@0$ITLibPlaylistKindSmart@1$"""
misc.update({})
r = objc.registerMetaDataForSelector
objc._updatingMetadata(True)
try:
    r(b"ITLibAlbum", b"isCompilation", {"retval": {"type": "Z"}})
    r(b"ITLibAlbum", b"isGapless", {"retval": {"type": "Z"}})
    r(b"ITLibAlbum", b"isRatingComputed", {"retval": {"type": "Z"}})
    r(
        b"ITLibMediaEntity",
        b"enumerateValuesExceptForProperties:usingBlock:",
        {
            "arguments": {
                3: {
                    "callable": {
                        "retval": {"type": b"v"},
                        "arguments": {
                            0: {"type": b"^v"},
                            1: {"type": b"@"},
                            2: {"type": b"@"},
                            3: {"type": b"o^Z"},
                        },
                    }
                }
            }
        },
    )
    r(
        b"ITLibMediaEntity",
        b"enumerateValuesForProperties:usingBlock:",
        {
            "arguments": {
                3: {
                    "callable": {
                        "retval": {"type": b"v"},
                        "arguments": {
                            0: {"type": b"^v"},
                            1: {"type": b"@"},
                            2: {"type": b"@"},
                            3: {"type": b"o^Z"},
                        },
                    }
                }
            }
        },
    )
    r(b"ITLibMediaItem", b"hasArtworkAvailable", {"retval": {"type": "Z"}})
    r(b"ITLibMediaItem", b"isCloud", {"retval": {"type": "Z"}})
    r(b"ITLibMediaItem", b"isDRMProtected", {"retval": {"type": "Z"}})
    r(b"ITLibMediaItem", b"isPurchased", {"retval": {"type": "Z"}})
    r(b"ITLibMediaItem", b"isRatingComputed", {"retval": {"type": "Z"}})
    r(b"ITLibMediaItem", b"isUserDisabled", {"retval": {"type": "Z"}})
    r(b"ITLibMediaItem", b"isVideo", {"retval": {"type": "Z"}})
    r(b"ITLibMediaItemVideoInfo", b"isHD", {"retval": {"type": "Z"}})
    r(b"ITLibPlaylist", b"isAllItemsPlaylist", {"retval": {"type": "Z"}})
    r(b"ITLibPlaylist", b"isMaster", {"retval": {"type": "Z"}})
    r(b"ITLibPlaylist", b"isVisible", {"retval": {"type": "Z"}})
    r(
        b"ITLibrary",
        b"initWithAPIVersion:error:",
        {"arguments": {3: {"type_modifier": b"o"}}},
    )
    r(
        b"ITLibrary",
        b"initWithAPIVersion:options:error:",
        {"arguments": {4: {"type_modifier": b"o"}}},
    )
    r(
        b"ITLibrary",
        b"libraryWithAPIVersion:error:",
        {"arguments": {3: {"type_modifier": b"o"}}},
    )
    r(
        b"ITLibrary",
        b"libraryWithAPIVersion:options:error:",
        {"arguments": {4: {"type_modifier": b"o"}}},
    )
    r(b"ITLibrary", b"reloadData", {"retval": {"type": "Z"}})
    r(b"ITLibrary", b"shouldShowContentRating", {"retval": {"type": "Z"}})
finally:
    objc._updatingMetadata(False)
expressions = {}

# END OF FILE