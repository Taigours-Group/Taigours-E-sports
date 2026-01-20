
/**
 * @typedef {'freefire' | 'pubg' | 'ludo'} GameType
 */

/**
 * @typedef {Object} Tournament
 * @property {string} id
 * @property {GameType} type
 * @property {string} game
 * @property {string} title
 * @property {string} date
 * @property {string} time
 * @property {string} image
 * @property {string} location
 * @property {string} prize
 * @property {string} entryFee
 * @property {string} registrationUrl
 * @property {string} streamId
 */

/**
 * @typedef {Object} Registration
 * @property {string} id
 * @property {string} tournamentId
 * @property {string} tournamentTitle
 * @property {string} playerName
 * @property {string} playerEmail
 * @property {string} playerContact
 * @property {string} gameUid
 * @property {number} registrationDate
 */

/**
 * @typedef {Object} StreamVideo
 * @property {string} id
 * @property {string} title
 * @property {string} youtubeId
 * @property {boolean} isLive
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} id
 * @property {GameType} game
 * @property {string} teamName
 * @property {string} avatar
 * @property {number} kills
 * @property {number} wins
 * @property {number} points
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} username
 * @property {string} text
 * @property {number} timestamp
 */

/**
 * @typedef {Object} LogEntry
 * @property {string} id
 * @property {'GET' | 'POST' | 'DELETE' | 'SYSTEM'} method
 * @property {string} endpoint
 * @property {string} timestamp
 * @property {'SUCCESS' | 'ERROR' | 'PENDING'} status
 */
