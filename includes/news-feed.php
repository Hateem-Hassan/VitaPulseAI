<?php
function getWHONews() {
    $rss_url = 'https://www.who.int/feeds/entity/csr/don/en/rss.xml';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $rss_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'VitaPulse Health Platform');
    
    $rss_content = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code === 200 && $rss_content) {
        $xml = simplexml_load_string($rss_content);
        if ($xml) {
            $news_items = [];
            $count = 0;
            
            foreach ($xml->channel->item as $item) {
                if ($count >= 3) break;
                
                $news_items[] = [
                    'title' => (string)$item->title,
                    'link' => (string)$item->link,
                    'pubDate' => date('M j, Y', strtotime((string)$item->pubDate)),
                    'description' => substr(strip_tags((string)$item->description), 0, 150) . '...'
                ];
                $count++;
            }
            
            return $news_items;
        }
    }
    
    return [
        [
            'title' => 'WHO Global Health Update',
            'link' => '#',
            'pubDate' => date('M j, Y'),
            'description' => 'Stay informed with the latest global health news and updates from the World Health Organization.'
        ]
    ];
}

$news_items = getWHONews();
?>

<div class="card">
    <h2>Latest Health News</h2>
    <?php foreach ($news_items as $item): ?>
    <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
        <h3 style="font-size: 16px; margin: 0 0 8px 0;">
            <a href="<?php echo htmlspecialchars($item['link']); ?>" target="_blank">
                <?php echo htmlspecialchars($item['title']); ?>
            </a>
        </h3>
        <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">
            <?php echo $item['pubDate']; ?>
        </p>
        <p style="font-size: 14px; margin: 0;">
            <?php echo htmlspecialchars($item['description']); ?>
        </p>
    </div>
    <?php endforeach; ?>
</div>
